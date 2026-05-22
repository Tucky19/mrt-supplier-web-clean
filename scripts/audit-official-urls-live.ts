import { writeFile } from "node:fs/promises";
import { products } from "../data/products/index";

type AuditStatus =
  | "ok"
  | "redirected"
  | "partNo_mismatch"
  | "not_found"
  | "forbidden"
  | "timeout"
  | "request_failed"
  | "malformed_url"
  | "missing_url";

type AuditResult = {
  id: string;
  partNo: string;
  brand: string;
  title?: string;
  officialUrl?: string;
  status: AuditStatus;
  httpStatus?: number;
  finalUrl?: string;
  redirected: boolean;
  mismatchReason?: string;
  note?: string;
  requestMethod?: "HEAD" | "GET";
};

type AuditReport = {
  generatedAt: string;
  totalProductsChecked: number;
  totalOfficialUrlsChecked: number;
  statusCounts: Record<AuditStatus, number>;
  brokenOrUnusable: AuditResult[];
  redirected: AuditResult[];
  mismatches: AuditResult[];
  manualReview: AuditResult[];
  results: AuditResult[];
};

const TIMEOUT_MS = 10000;
const CONCURRENCY = 4;
const REPORT_MD = "official-url-live-check-report.md";
const REPORT_JSON = "official-url-live-check-report.json";
const STATUS_ORDER: AuditStatus[] = [
  "ok",
  "redirected",
  "partNo_mismatch",
  "not_found",
  "forbidden",
  "timeout",
  "request_failed",
  "malformed_url",
  "missing_url",
];
const REVIEW_STATUSES = new Set<AuditStatus>([
  "redirected",
  "partNo_mismatch",
  "request_failed",
  "timeout",
  "forbidden",
]);

function buildInitialCounts(): Record<AuditStatus, number> {
  return STATUS_ORDER.reduce(
    (acc, status) => {
      acc[status] = 0;
      return acc;
    },
    {} as Record<AuditStatus, number>
  );
}

function withTimeoutSignal(timeoutMs: number): AbortSignal {
  return AbortSignal.timeout(timeoutMs);
}

function isDonaldson(product: { brand?: string; officialUrl?: string }) {
  return (
    product.brand?.toLowerCase() === "donaldson" ||
    product.officialUrl?.includes("donaldson.com") === true
  );
}

function escapeMarkdown(value: string) {
  return value.replace(/\|/g, "\\|");
}

function truncate(value: string, max = 160) {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function inferNotFound(status?: number) {
  return status === 404 || status === 410;
}

function inferForbidden(status?: number) {
  return status === 401 || status === 403;
}

async function fetchWithFallback(
  url: string
): Promise<{
  response?: Response;
  requestMethod?: "HEAD" | "GET";
  note?: string;
  error?: unknown;
}> {
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: withTimeoutSignal(TIMEOUT_MS),
      headers: {
        "user-agent": "mrt-supplier-web-clean official-url-audit/1.0",
      },
    });

    return {
      response: headResponse,
      requestMethod: "HEAD",
    };
  } catch (headError) {
    try {
      const getResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: withTimeoutSignal(TIMEOUT_MS),
        headers: {
          "user-agent": "mrt-supplier-web-clean official-url-audit/1.0",
        },
      });

      return {
        response: getResponse,
        requestMethod: "GET",
        note: "HEAD failed; GET fallback used",
      };
    } catch (getError) {
      return {
        error: getError ?? headError,
      };
    }
  }
}

async function verifyDonaldsonMatch(
  partNo: string,
  originalUrl: string,
  response: Response,
  requestMethod?: "HEAD" | "GET"
): Promise<{ mismatch: boolean; reason?: string; note?: string }> {
  const normalizedPartNo = partNo.toUpperCase();
  const finalUrl = response.url || originalUrl;

  if (finalUrl.toUpperCase().includes(normalizedPartNo)) {
    return { mismatch: false };
  }

  if (requestMethod === "GET") {
    const text = await response.text();
    if (text.toUpperCase().includes(normalizedPartNo)) {
      return {
        mismatch: false,
        note: "Verified via page content",
      };
    }

    const matchedPartNos = Array.from(
      new Set(text.toUpperCase().match(/\b[A-Z]\d{5,}\b/g) ?? [])
    );

    return {
      mismatch: true,
      reason: matchedPartNos.length
        ? `Final URL/content did not match ${partNo}; found ${matchedPartNos
            .slice(0, 5)
            .join(", ")}`
        : `Final URL/content did not match ${partNo}`,
    };
  }

  const fallback = await fetch(originalUrl, {
    method: "GET",
    redirect: "follow",
    signal: withTimeoutSignal(TIMEOUT_MS),
    headers: {
      "user-agent": "mrt-supplier-web-clean official-url-audit/1.0",
    },
  });

  const finalFallbackUrl = fallback.url || finalUrl;
  if (finalFallbackUrl.toUpperCase().includes(normalizedPartNo)) {
    return {
      mismatch: false,
      note: "Verified via GET fallback final URL",
    };
  }

  const text = await fallback.text();
  if (text.toUpperCase().includes(normalizedPartNo)) {
    return {
      mismatch: false,
      note: "Verified via GET fallback page content",
    };
  }

  const matchedPartNos = Array.from(
    new Set(text.toUpperCase().match(/\b[A-Z]\d{5,}\b/g) ?? [])
  );

  return {
    mismatch: true,
    reason: matchedPartNos.length
      ? `Final URL/content did not match ${partNo}; found ${matchedPartNos
          .slice(0, 5)
          .join(", ")}`
      : `Final URL/content did not match ${partNo}`,
  };
}

async function auditProduct(product: (typeof products)[number]): Promise<AuditResult> {
  if (!product.officialUrl) {
    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      status: "missing_url",
      redirected: false,
    };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(product.officialUrl);
  } catch {
    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      officialUrl: product.officialUrl,
      status: "malformed_url",
      redirected: false,
      note: "URL constructor rejected the current officialUrl",
    };
  }

  const result = await fetchWithFallback(parsedUrl.toString());
  if (!result.response) {
    const error = result.error;
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "TimeoutError"
    ) {
      return {
        id: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title,
        officialUrl: product.officialUrl,
        status: "timeout",
        redirected: false,
        note: `Timed out after ${TIMEOUT_MS}ms`,
      };
    }

    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      officialUrl: product.officialUrl,
      status: "request_failed",
      redirected: false,
      note:
        error instanceof Error
          ? truncate(error.message)
          : "Request failed before a response was received",
    };
  }

  const response = result.response;
  const finalUrl = response.url || product.officialUrl;
  const redirected = finalUrl !== product.officialUrl || response.redirected;

  if (inferForbidden(response.status)) {
    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      officialUrl: product.officialUrl,
      status: "forbidden",
      httpStatus: response.status,
      finalUrl,
      redirected,
      requestMethod: result.requestMethod,
      note: result.note,
    };
  }

  if (inferNotFound(response.status)) {
    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      officialUrl: product.officialUrl,
      status: "not_found",
      httpStatus: response.status,
      finalUrl,
      redirected,
      requestMethod: result.requestMethod,
      note: result.note,
    };
  }

  if (!response.ok) {
    return {
      id: product.id,
      partNo: product.partNo,
      brand: product.brand,
      title: product.title,
      officialUrl: product.officialUrl,
      status: "request_failed",
      httpStatus: response.status,
      finalUrl,
      redirected,
      requestMethod: result.requestMethod,
      note: result.note ?? `Unexpected HTTP status ${response.status}`,
    };
  }

  if (isDonaldson(product)) {
    try {
      const matchCheck = await verifyDonaldsonMatch(
        product.partNo,
        product.officialUrl,
        response,
        result.requestMethod
      );

      if (matchCheck.mismatch) {
        return {
          id: product.id,
          partNo: product.partNo,
          brand: product.brand,
          title: product.title,
          officialUrl: product.officialUrl,
          status: "partNo_mismatch",
          httpStatus: response.status,
          finalUrl,
          redirected,
          mismatchReason: matchCheck.reason,
          requestMethod: result.requestMethod,
          note: matchCheck.note ?? result.note,
        };
      }

      return {
        id: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title,
        officialUrl: product.officialUrl,
        status: redirected ? "redirected" : "ok",
        httpStatus: response.status,
        finalUrl,
        redirected,
        requestMethod: result.requestMethod,
        note: matchCheck.note ?? result.note,
      };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "TimeoutError"
      ) {
        return {
          id: product.id,
          partNo: product.partNo,
          brand: product.brand,
          title: product.title,
          officialUrl: product.officialUrl,
          status: "timeout",
          httpStatus: response.status,
          finalUrl,
          redirected,
          requestMethod: result.requestMethod,
          note: `Timed out during Donaldson mismatch verification after ${TIMEOUT_MS}ms`,
        };
      }

      return {
        id: product.id,
        partNo: product.partNo,
        brand: product.brand,
        title: product.title,
        officialUrl: product.officialUrl,
        status: "request_failed",
        httpStatus: response.status,
        finalUrl,
        redirected,
        requestMethod: result.requestMethod,
        note:
          error instanceof Error
            ? truncate(error.message)
            : "Donaldson mismatch verification failed",
      };
    }
  }

  return {
    id: product.id,
    partNo: product.partNo,
    brand: product.brand,
    title: product.title,
    officialUrl: product.officialUrl,
    status: redirected ? "redirected" : "ok",
    httpStatus: response.status,
    finalUrl,
    redirected,
    requestMethod: result.requestMethod,
    note: result.note,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;

      if (current >= items.length) {
        return;
      }

      results[current] = await mapper(items[current], current);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );

  return results;
}

function buildMarkdown(report: AuditReport) {
  const lines: string[] = [];
  lines.push("# Official URL Live Check Report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total products checked: ${report.totalProductsChecked}`);
  lines.push(`- Total officialUrls checked: ${report.totalOfficialUrlsChecked}`);
  for (const status of STATUS_ORDER) {
    lines.push(`- ${status}: ${report.statusCounts[status]}`);
  }
  lines.push("");

  const broken = report.brokenOrUnusable;
  lines.push("## Broken/Unusable URLs");
  lines.push("");
  if (!broken.length) {
    lines.push("None.");
  } else {
    lines.push("| PartNo | Brand | Status | HTTP | officialUrl | Final URL | Note |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const item of broken) {
      lines.push(
        `| ${escapeMarkdown(item.partNo)} | ${escapeMarkdown(
          item.brand
        )} | ${item.status} | ${item.httpStatus ?? ""} | ${escapeMarkdown(
          item.officialUrl ?? ""
        )} | ${escapeMarkdown(item.finalUrl ?? "")} | ${escapeMarkdown(
          item.mismatchReason ?? item.note ?? ""
        )} |`
      );
    }
  }
  lines.push("");

  lines.push("## Redirected URLs");
  lines.push("");
  if (!report.redirected.length) {
    lines.push("None.");
  } else {
    lines.push("| PartNo | Brand | HTTP | officialUrl | Final URL | Note |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const item of report.redirected) {
      lines.push(
        `| ${escapeMarkdown(item.partNo)} | ${escapeMarkdown(
          item.brand
        )} | ${item.httpStatus ?? ""} | ${escapeMarkdown(
          item.officialUrl ?? ""
        )} | ${escapeMarkdown(item.finalUrl ?? "")} | ${escapeMarkdown(
          item.note ?? ""
        )} |`
      );
    }
  }
  lines.push("");

  lines.push("## Part Number Mismatch");
  lines.push("");
  if (!report.mismatches.length) {
    lines.push("None.");
  } else {
    lines.push("| PartNo | Brand | HTTP | officialUrl | Final URL | Reason |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const item of report.mismatches) {
      lines.push(
        `| ${escapeMarkdown(item.partNo)} | ${escapeMarkdown(
          item.brand
        )} | ${item.httpStatus ?? ""} | ${escapeMarkdown(
          item.officialUrl ?? ""
        )} | ${escapeMarkdown(item.finalUrl ?? "")} | ${escapeMarkdown(
          item.mismatchReason ?? item.note ?? ""
        )} |`
      );
    }
  }
  lines.push("");

  lines.push("## Recommended Manual Review");
  lines.push("");
  if (!report.manualReview.length) {
    lines.push("None.");
  } else {
    lines.push("| PartNo | Brand | Status | HTTP | officialUrl | Final URL | Note |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const item of report.manualReview) {
      lines.push(
        `| ${escapeMarkdown(item.partNo)} | ${escapeMarkdown(
          item.brand
        )} | ${item.status} | ${item.httpStatus ?? ""} | ${escapeMarkdown(
          item.officialUrl ?? ""
        )} | ${escapeMarkdown(item.finalUrl ?? "")} | ${escapeMarkdown(
          item.mismatchReason ?? item.note ?? ""
        )} |`
      );
    }
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    `- Requests used timeout ${TIMEOUT_MS}ms and concurrency ${CONCURRENCY}.`
  );
  lines.push("- HEAD was attempted first; GET was used as fallback when HEAD failed.");
  lines.push("- This audit did not modify any product data.");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const activeProducts = [...products].sort((a, b) => {
    const aDonaldson = isDonaldson(a) ? 0 : 1;
    const bDonaldson = isDonaldson(b) ? 0 : 1;
    if (aDonaldson !== bDonaldson) {
      return aDonaldson - bDonaldson;
    }
    return a.partNo.localeCompare(b.partNo);
  });

  const results = await mapWithConcurrency(
    activeProducts,
    CONCURRENCY,
    async (product) => auditProduct(product)
  );

  const statusCounts = buildInitialCounts();
  for (const result of results) {
    statusCounts[result.status] += 1;
  }

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    totalProductsChecked: activeProducts.length,
    totalOfficialUrlsChecked: results.filter(
      (result) => result.status !== "missing_url"
    ).length,
    statusCounts,
    brokenOrUnusable: results.filter((result) =>
      [
        "partNo_mismatch",
        "not_found",
        "forbidden",
        "timeout",
        "request_failed",
        "malformed_url",
        "missing_url",
      ].includes(result.status)
    ),
    redirected: results.filter((result) => result.status === "redirected"),
    mismatches: results.filter((result) => result.status === "partNo_mismatch"),
    manualReview: results.filter((result) => REVIEW_STATUSES.has(result.status)),
    results,
  };

  await writeFile(REPORT_MD, buildMarkdown(report), "utf8");
  await writeFile(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

  console.log(
    JSON.stringify(
      {
        reportMd: REPORT_MD,
        reportJson: REPORT_JSON,
        totalProductsChecked: report.totalProductsChecked,
        totalOfficialUrlsChecked: report.totalOfficialUrlsChecked,
        statusCounts: report.statusCounts,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
