import { prisma } from "@/lib/prisma";
import { getMissingProductRequestItemDetails } from "@/lib/rfq/missingProductRequest";

type SearchEventRow = {
  id: string;
  query: string | null;
  resultCount: number | null;
  matchType: string | null;
  createdAt: Date;
};

type SearchGroupRow = {
  query: string | null;
  _count: {
    _all: number;
  };
};

type MissingProductRequestRow = {
  id: string;
  requestId: string;
  status: string;
  source: string;
  createdAt: Date;
  items: Array<{
    partNo: string;
    brand: string | null;
    category: string | null;
    qty: number;
    spec: string | null;
    productId: string | null;
    meta: unknown;
  }>;
};

type MergedCountRow = {
  key: string;
  label: string;
  count: number;
};

const DEFAULT_ANALYTICS_DAYS = 30;
const TOP_SEARCH_TERMS_LIMIT = 20;
const TOP_NO_RESULT_QUERIES_LIMIT = 20;
const RECENT_SEARCHES_LIMIT = 20;
const LATEST_MISSING_REQUESTS_LIMIT = 20;
const REVIEW_REQUESTS_LIMIT = 6;
const ACTION_TERMS_LIMIT = 6;
const THREAD_SIZE_DEMAND_LIMIT = 20;
const DIMENSION_DEMAND_LIMIT = 20;

const FILTER_TYPE_LABELS: Record<string, string> = {
  fuel_filter: "Fuel Filter",
  fuel_water_separator: "Fuel Water Separator",
  hydraulic_filter: "Hydraulic Filter",
  lube_filter: "Lube Filter",
  oil_filter: "Oil Filter",
  separator: "Separator",
  oil_separator: "Oil Separator",
  air_oil_separator: "Air/Oil Separator",
  water_filter: "Water Filter",
  other: "Other",
  not_sure: "Not sure",
};

export type SearchDemandDashboardData = {
  days: number;
  searchSummary: {
    totalSearches: number;
    noResultSearches: number;
    topSearchTerms: Array<{
      query: string;
      count: number;
    }>;
    recentSearchTerms: Array<{
      id: string;
      query: string;
      resultCount: number | null;
      createdAt: Date;
    }>;
  };
  noResultDemand: {
    topQueries: Array<{
      query: string;
      count: number;
      relatedMissingRequests: number;
      latestRelatedRequest: {
        id: string;
        requestId: string;
      } | null;
    }>;
    latestSearches: Array<{
      id: string;
      query: string;
      createdAt: Date;
      relatedMissingRequests: number;
      latestRelatedRequest: {
        id: string;
        requestId: string;
      } | null;
    }>;
  };
  missingProductRequests: {
    total: number;
    latestRequests: Array<{
      id: string;
      requestId: string;
      status: string;
      source: string;
      createdAt: Date;
      partNo: string | null;
      filterType: string | null;
      qty: number | null;
      sourcePage: string | null;
      searchQuery: string | null;
    }>;
    countByFilterType: Array<{
      filterType: string;
      count: number;
    }>;
    countByStatus: Array<{
      status: string;
      count: number;
    }>;
    countBySource: Array<{
      source: string;
      count: number;
    }>;
  };
  threadSizeDemand: {
    topThreadSizes: Array<{
      filterType: string;
      threadSize: string;
      count: number;
    }>;
  };
  dimensionDemand: {
    topCombinations: Array<{
      filterType: string;
      dimensions: string;
      count: number;
    }>;
  };
  recommendedNextActions: {
    catalogOpportunities: Array<{
      query: string;
      searches: number;
      relatedMissingRequests: number;
    }>;
    requestsNeedingReview: Array<{
      id: string;
      requestId: string;
      status: string;
      createdAt: Date;
      summary: string;
    }>;
    repeatedNoResultTerms: Array<{
      query: string;
      searches: number;
    }>;
  };
};

function safeStr(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeQueryKey(value: string | null | undefined) {
  return safeStr(value).toLowerCase();
}

function toLabel(value: string | null | undefined, fallback: string) {
  const normalized = safeStr(value);
  return normalized || fallback;
}

function mergeCounts(rows: Array<{ key: string; label: string; count: number }>) {
  const grouped = new Map<string, { label: string; count: number }>();

  for (const row of rows) {
    const existing = grouped.get(row.key);
    if (existing) {
      existing.count += row.count;
      continue;
    }

    grouped.set(row.key, {
      label: row.label,
      count: row.count,
    });
  }

  return Array.from(grouped.entries())
    .map(([key, value]) => ({
      key,
      label: value.label,
      count: value.count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)) as MergedCountRow[];
}

function hasKey(row: MergedCountRow) {
  return Boolean(row.key);
}

function byLabelAndCount(row: MergedCountRow) {
  return {
    query: row.label,
    count: row.count,
  };
}

function byFilterTypeAndCount(row: MergedCountRow) {
  return {
    filterType: row.label,
    count: row.count,
  };
}

function byStatusAndCount(row: MergedCountRow) {
  return {
    status: row.label,
    count: row.count,
  };
}

function bySourceAndCount(row: MergedCountRow) {
  return {
    source: row.label,
    count: row.count,
  };
}

function normalizeFilterTypeLabel(value: string | null | undefined) {
  const raw = safeStr(value);
  const key = raw.toLowerCase();

  return FILTER_TYPE_LABELS[key] ?? raw;
}

function formatDimensionCombination(details: {
  outerDiameter?: string | null;
  innerDiameter?: string | null;
  lengthHeight?: string | null;
}) {
  return [
    details.outerDiameter ? `OD ${details.outerDiameter}` : "",
    details.innerDiameter ? `ID ${details.innerDiameter}` : "",
    details.lengthHeight ? `L ${details.lengthHeight}` : "",
  ]
    .filter(Boolean)
    .join(" / ");
}

function createEmptyDashboardData(days: number): SearchDemandDashboardData {
  return {
    days,
    searchSummary: {
      totalSearches: 0,
      noResultSearches: 0,
      topSearchTerms: [],
      recentSearchTerms: [],
    },
    noResultDemand: {
      topQueries: [],
      latestSearches: [],
    },
    missingProductRequests: {
      total: 0,
      latestRequests: [],
      countByFilterType: [],
      countByStatus: [],
      countBySource: [],
    },
    threadSizeDemand: {
      topThreadSizes: [],
    },
    dimensionDemand: {
      topCombinations: [],
    },
    recommendedNextActions: {
      catalogOpportunities: [],
      requestsNeedingReview: [],
      repeatedNoResultTerms: [],
    },
  };
}

function logDashboardWarning(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : undefined;

  console.warn("[ADMIN_ANALYTICS_DASHBOARD]", {
    scope,
    code,
    message,
  });
}

function getSafeMissingProductRequestItemDetails(item: unknown) {
  try {
    if (!item || typeof item !== "object") {
      return null;
    }

    return getMissingProductRequestItemDetails(item);
  } catch (error) {
    logDashboardWarning("missing_product_request_item_parse", error);
    return null;
  }
}

export function parseAnalyticsDays(
  value: string | undefined,
  fallback = DEFAULT_ANALYTICS_DAYS,
) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 180) {
    return fallback;
  }

  return Math.floor(parsed);
}

function getElapsedMs(startedAt: number) {
  return Date.now() - startedAt;
}

function logDashboardTiming(payload: {
  days: number;
  searchDemandQueryMs: number;
  missingProductQueryMs: number;
  totalDashboardMs: number;
}) {
  console.info("[ADMIN_ANALYTICS_DASHBOARD_TIMING]", payload);
}

export async function getSearchDemandDashboardData(
  days: number,
): Promise<SearchDemandDashboardData> {
  const startedAt = Date.now();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const emptyData = createEmptyDashboardData(days);

  try {
    const [
      searchSection,
      missingProductSection,
    ] = await Promise.all([
      (async () => {
        const searchStartedAt = Date.now();
        try {
          const [
            totalSearches,
            noResultSearches,
            topSearchGrouped,
            recentSearchesRaw,
            topNoResultGrouped,
            latestNoResultSearchesRaw,
          ] = await Promise.all([
            prisma.searchEvent.count({
              where: {
                type: "search",
                createdAt: { gte: since },
              },
            }),
            prisma.searchEvent.count({
              where: {
                type: "search",
                createdAt: { gte: since },
                resultCount: 0,
              },
            }),
            prisma.searchEvent.groupBy({
              by: ["query"],
              where: {
                type: "search",
                createdAt: { gte: since },
                query: { not: null },
              },
              _count: { _all: true },
            }),
            prisma.searchEvent.findMany({
              where: {
                type: "search",
                createdAt: { gte: since },
                query: { not: null },
              },
              orderBy: { createdAt: "desc" },
              take: RECENT_SEARCHES_LIMIT,
              select: {
                id: true,
                query: true,
                resultCount: true,
                matchType: true,
                createdAt: true,
              },
            }),
            prisma.searchEvent.groupBy({
              by: ["query"],
              where: {
                type: "search",
                createdAt: { gte: since },
                query: { not: null },
                resultCount: 0,
              },
              _count: { _all: true },
            }),
            prisma.searchEvent.findMany({
              where: {
                type: "search",
                createdAt: { gte: since },
                resultCount: 0,
                query: { not: null },
              },
              orderBy: { createdAt: "desc" },
              take: RECENT_SEARCHES_LIMIT,
              select: {
                id: true,
                query: true,
                resultCount: true,
                matchType: true,
                createdAt: true,
              },
            }),
          ]);

          return {
            queryMs: getElapsedMs(searchStartedAt),
            totalSearches,
            noResultSearches,
            topSearchGrouped,
            recentSearchesRaw,
            topNoResultGrouped,
            latestNoResultSearchesRaw,
          };
        } catch (error) {
          logDashboardWarning("search_events_query", error);
          return {
            queryMs: getElapsedMs(searchStartedAt),
            totalSearches: 0,
            noResultSearches: 0,
            topSearchGrouped: [],
            recentSearchesRaw: [],
            topNoResultGrouped: [],
            latestNoResultSearchesRaw: [],
          };
        }
      })(),
      (async () => {
        const missingStartedAt = Date.now();
        try {
          const [latestRfqsRaw, statusGroupsRaw, sourceGroupsRaw, itemRowsRaw] =
            await Promise.all([
              prisma.rfq.findMany({
                where: {
                  source: "missing_product_request",
                  createdAt: { gte: since },
                },
                orderBy: { createdAt: "desc" },
                take: LATEST_MISSING_REQUESTS_LIMIT,
                select: {
                  id: true,
                  requestId: true,
                  status: true,
                  source: true,
                  createdAt: true,
                  items: {
                    orderBy: { createdAt: "asc" },
                    take: 1,
                    select: {
                      partNo: true,
                      brand: true,
                      category: true,
                      qty: true,
                      spec: true,
                      productId: true,
                      meta: true,
                    },
                  },
                },
              }),
              prisma.rfq.groupBy({
                by: ["status"],
                where: {
                  source: "missing_product_request",
                  createdAt: { gte: since },
                },
                _count: { _all: true },
              }),
              prisma.rfq.groupBy({
                by: ["source"],
                where: {
                  source: "missing_product_request",
                  createdAt: { gte: since },
                },
                _count: { _all: true },
              }),
              prisma.rfqItem.findMany({
                where: {
                  rfq: {
                    source: "missing_product_request",
                    createdAt: { gte: since },
                  },
                },
                select: {
                  category: true,
                  meta: true,
                },
              }),
            ]);

          return {
            queryMs: getElapsedMs(missingStartedAt),
            latestRfqsRaw,
            statusGroupsRaw,
            sourceGroupsRaw,
            itemRowsRaw,
          };
        } catch (error) {
          logDashboardWarning("missing_product_requests_query", error);
          return {
            queryMs: getElapsedMs(missingStartedAt),
            latestRfqsRaw: [],
            statusGroupsRaw: [],
            sourceGroupsRaw: [],
            itemRowsRaw: [],
          };
        }
      })(),
    ]);

    const {
      queryMs: searchDemandQueryMs,
      totalSearches,
      noResultSearches,
      topSearchGrouped,
      recentSearchesRaw,
      topNoResultGrouped,
      latestNoResultSearchesRaw,
    } = searchSection;
    const {
      queryMs: missingProductQueryMs,
      latestRfqsRaw,
      statusGroupsRaw,
      sourceGroupsRaw,
      itemRowsRaw,
    } = missingProductSection;

    const recentSearches = recentSearchesRaw as SearchEventRow[];
    const latestNoResultSearches = latestNoResultSearchesRaw as SearchEventRow[];
    const missingRequestRfqs = latestRfqsRaw as MissingProductRequestRow[];
    const topSearchRows = topSearchGrouped as SearchGroupRow[];
    const topNoResultRows = topNoResultGrouped as SearchGroupRow[];

    const topSearchTerms = mergeCounts(
      topSearchRows.map((row: SearchGroupRow) => ({
        key: normalizeQueryKey(row.query),
        label: safeStr(row.query),
        count: row._count._all,
      })),
    )
      .filter(hasKey)
      .slice(0, TOP_SEARCH_TERMS_LIMIT)
      .map(byLabelAndCount);

    const topNoResultTerms = mergeCounts(
      topNoResultRows.map((row: SearchGroupRow) => ({
        key: normalizeQueryKey(row.query),
        label: safeStr(row.query),
        count: row._count._all,
      })),
    ).filter(hasKey);

    const relatedMissingRequestMap = new Map<
      string,
      {
        count: number;
        latestRelatedRequest: {
          id: string;
          requestId: string;
        } | null;
      }
    >();

    const latestRequests = missingRequestRfqs
      .map((rfq) => {
      const firstItem = rfq.items[0];
      const details = firstItem
        ? getSafeMissingProductRequestItemDetails(firstItem)
        : null;
      const queryKey = normalizeQueryKey(details?.searchQuery);

      if (queryKey) {
        const existing = relatedMissingRequestMap.get(queryKey);
        if (existing) {
          existing.count += 1;
        } else {
          relatedMissingRequestMap.set(queryKey, {
            count: 1,
            latestRelatedRequest: {
              id: rfq.id,
              requestId: rfq.requestId,
            },
          });
        }
      }

      return {
        id: rfq.id,
        requestId: rfq.requestId,
        status: rfq.status,
        source: rfq.source,
        createdAt: rfq.createdAt,
        partNo: details?.partNo ?? firstItem?.partNo ?? null,
        filterType: details?.filterType ?? firstItem?.category ?? null,
        qty: details?.qty ?? firstItem?.qty ?? null,
        sourcePage: details?.sourcePage ?? null,
        searchQuery: details?.searchQuery ?? null,
      };
      });

    const countByFilterType = mergeCounts(
      (itemRowsRaw as Array<{ category: string | null; meta: unknown }>).map((item) => {
        const details = getSafeMissingProductRequestItemDetails(item);
        const filterType = toLabel(
          normalizeFilterTypeLabel(details?.filterType ?? item.category),
          "Unspecified",
        );

        return {
          key: filterType.toLowerCase(),
          label: filterType,
          count: 1,
        };
      }),
    )
      .slice(0, TOP_SEARCH_TERMS_LIMIT)
      .map(byFilterTypeAndCount);

    const threadSizeDemandMap = new Map<
      string,
      {
        filterType: string;
        threadSize: string;
        count: number;
      }
    >();

    for (const item of itemRowsRaw as Array<{ category: string | null; meta: unknown }>) {
      const details = getSafeMissingProductRequestItemDetails(item);
      const threadSize = safeStr(details?.threadSize);

      if (!threadSize) {
        continue;
      }

      const filterType = toLabel(
        normalizeFilterTypeLabel(details?.filterType ?? item.category),
        "Unspecified",
      );
      const key = `${filterType.toLowerCase()}::${threadSize.toLowerCase()}`;
      const existing = threadSizeDemandMap.get(key);

      if (existing) {
        existing.count += 1;
        continue;
      }

      threadSizeDemandMap.set(key, {
        filterType,
        threadSize,
        count: 1,
      });
    }

    const threadSizeDemandRows = Array.from(threadSizeDemandMap.values())
      .sort(
        (a, b) =>
          b.count - a.count ||
          a.threadSize.localeCompare(b.threadSize) ||
          a.filterType.localeCompare(b.filterType),
      )
      .slice(0, THREAD_SIZE_DEMAND_LIMIT);

    const dimensionDemandMap = new Map<
      string,
      {
        filterType: string;
        dimensions: string;
        count: number;
      }
    >();

    for (const item of itemRowsRaw as Array<{ category: string | null; meta: unknown }>) {
      const details = getSafeMissingProductRequestItemDetails(item);

      if (!details) {
        continue;
      }

      const dimensions = formatDimensionCombination(details);

      if (!dimensions) {
        continue;
      }

      const filterType = toLabel(
        normalizeFilterTypeLabel(details.filterType ?? item.category),
        "Unspecified",
      );
      const key = `${filterType.toLowerCase()}::${dimensions.toLowerCase()}`;
      const existing = dimensionDemandMap.get(key);

      if (existing) {
        existing.count += 1;
        continue;
      }

      dimensionDemandMap.set(key, {
        filterType,
        dimensions,
        count: 1,
      });
    }

    const dimensionDemandRows = Array.from(dimensionDemandMap.values())
      .sort(
        (a, b) =>
          b.count - a.count ||
          a.dimensions.localeCompare(b.dimensions) ||
          a.filterType.localeCompare(b.filterType),
      )
      .slice(0, DIMENSION_DEMAND_LIMIT);

    const countByStatus = (statusGroupsRaw as Array<{
      status: string | null;
      _count: { _all: number };
    }>).map((row) =>
      byStatusAndCount({
        key: safeStr(row.status).toLowerCase(),
        label: toLabel(row.status, "unknown"),
        count: row._count._all,
      }),
    );

    const countBySource = (sourceGroupsRaw as Array<{
      source: string | null;
      _count: { _all: number };
    }>).map((row) =>
      bySourceAndCount({
        key: safeStr(row.source).toLowerCase(),
        label: toLabel(row.source, "unknown"),
        count: row._count._all,
      }),
    );

    const topNoResultQueries = topNoResultTerms
      .slice(0, TOP_NO_RESULT_QUERIES_LIMIT)
      .map((row) => {
      const related = relatedMissingRequestMap.get(row.key);

      return {
        query: row.label,
        count: row.count,
        relatedMissingRequests: related?.count ?? 0,
        latestRelatedRequest: related?.latestRelatedRequest ?? null,
      };
      });

    const latestNoResultRows = latestNoResultSearches.map((row) => {
      const related = relatedMissingRequestMap.get(normalizeQueryKey(row.query));

      return {
        id: row.id,
        query: safeStr(row.query) || "-",
        createdAt: row.createdAt,
        relatedMissingRequests: related?.count ?? 0,
        latestRelatedRequest: related?.latestRelatedRequest ?? null,
      };
    });

    const requestsNeedingReview = latestRequests
      .filter((request) => request.status === "new" || request.status === "in_progress")
      .slice(0, REVIEW_REQUESTS_LIMIT)
      .map((request) => ({
        id: request.id,
        requestId: request.requestId,
        status: request.status,
        createdAt: request.createdAt,
        summary:
          [request.partNo, request.filterType].filter(Boolean).join(" / ") ||
          "Missing product request",
      }));

    const catalogOpportunities = topNoResultQueries
      .filter((row) => row.count >= 2)
      .slice(0, ACTION_TERMS_LIMIT)
      .map((row) => ({
        query: row.query,
        searches: row.count,
        relatedMissingRequests: row.relatedMissingRequests,
      }));

    const repeatedNoResultTerms = topNoResultQueries
      .filter((row) => row.count >= 2)
      .slice(0, ACTION_TERMS_LIMIT)
      .map((row) => ({
        query: row.query,
        searches: row.count,
      }));

    const data: SearchDemandDashboardData = {
      ...emptyData,
      days,
      searchSummary: {
        totalSearches,
        noResultSearches,
        topSearchTerms,
        recentSearchTerms: recentSearches.slice(0, RECENT_SEARCHES_LIMIT).map((row) => ({
          id: row.id,
          query: safeStr(row.query) || "-",
          resultCount: row.resultCount,
          createdAt: row.createdAt,
        })),
      },
      noResultDemand: {
        topQueries: topNoResultQueries,
        latestSearches: latestNoResultRows,
      },
      missingProductRequests: {
        total: countByStatus.reduce((sum, row) => sum + row.count, 0),
        latestRequests,
        countByFilterType,
        countByStatus,
        countBySource,
      },
      threadSizeDemand: {
        topThreadSizes: threadSizeDemandRows,
      },
      dimensionDemand: {
        topCombinations: dimensionDemandRows,
      },
      recommendedNextActions: {
        catalogOpportunities,
        requestsNeedingReview,
        repeatedNoResultTerms,
      },
    };

    logDashboardTiming({
      days,
      searchDemandQueryMs,
      missingProductQueryMs,
      totalDashboardMs: getElapsedMs(startedAt),
    });

    return data;
  } catch (error) {
    logDashboardWarning("dashboard_data_build", error);
    logDashboardTiming({
      days,
      searchDemandQueryMs: 0,
      missingProductQueryMs: 0,
      totalDashboardMs: getElapsedMs(startedAt),
    });
    return emptyData;
  }
}
