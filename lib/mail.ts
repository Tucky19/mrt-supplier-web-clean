import nodemailer from "nodemailer";
import {
  buildMissingProductRequestDimensionSummary,
  getMissingProductThreadSystemLabel,
  getMissingProductRequestItemDetails,
  isMissingProductRequestItem,
} from "@/lib/rfq/missingProductRequest";
import { getRfqReferenceContexts } from "@/lib/rfq/referenceContext";

function safeStr(v: unknown) {
  return String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function parseSmtpPort(value: string) {
  const parsed = Number(value || 465);
  return Number.isFinite(parsed) ? parsed : 465;
}

function parseSmtpSecure(value: string, port: number) {
  const normalized = safeStr(value).toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return port === 465;
}

function parseEmailList(value: string) {
  const items = value
    .split(",")
    .map((item) => safeStr(item))
    .filter(Boolean);

  const unique = Array.from(new Set(items));
  return unique.length > 0 ? unique : undefined;
}

function formatFromAddress(address: string) {
  return `"MRT Supplier" <${address}>`;
}

const PUBLIC_REPLY_TO_EMAIL = "sales@mrtsupplier.com";
const PUBLIC_WEBSITE = "www.mrtsupplier.com";
const PUBLIC_PHONE = "081-558-1323 / 097-012-2111";
const PUBLIC_LINE_ID = "@mrtsupplier";
const PUBLIC_LINE_ADD_FRIEND_URL = "https://lin.ee/S676yYH";
const SYSTEM_FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif";
const MISSING_PRODUCT_REQUEST_LABEL =
  "คำขอสินค้าที่ไม่พบ / Missing Product Request";

function getMailEnv() {
  const host = safeStr(process.env.SMTP_HOST) || "smtppro.zoho.com";
  const port = parseSmtpPort(safeStr(process.env.SMTP_PORT));
  const secure = parseSmtpSecure(safeStr(process.env.SMTP_SECURE), port);
  const user = safeStr(process.env.SMTP_USER);
  const pass = safeStr(process.env.SMTP_PASS);
  const to = safeStr(process.env.RFQ_TO_EMAIL || user);
  const cc = parseEmailList(safeStr(process.env.RFQ_CC_EMAIL || ""));
  const fromAddress = safeStr(process.env.RFQ_FROM_EMAIL || user);
  const from = fromAddress ? formatFromAddress(fromAddress) : "";

  return {
    host,
    port,
    secure,
    user,
    pass,
    to,
    cc,
    from,
    fromAddress,
  };
}

export function isMailConfigured() {
  const { host, port, user, pass, to, fromAddress } = getMailEnv();

  return !!(host && port && user && pass && to && fromAddress);
}

function getSafeMailDiagnostics() {
  const { host, port, secure, user, pass, fromAddress, to, cc } = getMailEnv();

  return {
    host,
    port,
    secure,
    user,
    hasPass: Boolean(pass),
    passLen: pass?.length ?? 0,
    from: fromAddress || user,
    to,
    cc,
  };
}

function getTransporter() {
  const { host, port, secure, user, pass } = getMailEnv();
  const diagnostics = getSafeMailDiagnostics();

  if (!user) {
    throw new Error("SMTP_USER is missing.");
  }

  if (!pass) {
    throw new Error("SMTP_PASS is missing.");
  }

  if (host === "zoho.com") {
    throw new Error(
      'SMTP_HOST must be a valid Zoho SMTP host such as "smtppro.zoho.com" or "smtp.zoho.com", not "zoho.com".'
    );
  }

  console.info("[RFQ_MAIL] env_check", diagnostics);

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
      servername: host,
    },
  });
}

export async function verifyMailTransport() {
  const transporter = getTransporter();
  await transporter.verify();
  return getSafeMailDiagnostics();
}

export function getMailDiagnostics() {
  return getSafeMailDiagnostics();
}

function getErrorCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
    ? (error as { code: string }).code
    : undefined;
}

type MailQuoteItem = {
  productId: string;
  partNo: string;
  brand?: string | null;
  category?: string | null;
  title?: string | null;
  spec?: string | null;
  qty: number;
  meta?: unknown;
};

type MailCustomer = {
  company?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  lineId?: string | null;
  note?: string | null;
  contactPref?: string | null;
};

function escapeHtml(input: unknown) {
  return safeStr(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function textValue(input: unknown) {
  if (input === null || input === undefined) {
    return "";
  }

  if (typeof input === "object") {
    return "";
  }

  return safeStr(input);
}

function displayText(input: unknown) {
  return textValue(input) || "-";
}

function buildThaiCustomerName(name: string | null | undefined) {
  return textValue(name) || "ลูกค้า";
}

function buildEnglishCustomerName(name: string | null | undefined) {
  return textValue(name) || "Customer";
}

function subjectPart(input: unknown) {
  return textValue(input).replace(/[\r\n\t]+/g, " ");
}

function buildItemsText(items: MailQuoteItem[]) {
  return items
    .map((it, idx) => {
      const referenceQueries = getRfqReferenceContexts(it.meta).map(
        (context) => context.searchQuery,
      );
      const parts = [
        `${idx + 1}. ลำดับ / Item: ${idx + 1}`,
        `เบอร์สินค้า / Part No.: ${displayText(it.partNo)}`,
        `จำนวน / Qty: ${displayText(it.qty)}`,
        `แบรนด์ / Brand: ${displayText(it.brand)}`,
        `ชื่อสินค้า / Product: ${displayText(it.title)}`,
        `หมวดหมู่ / Category: ${displayText(it.category)}`,
        it.spec ? `Spec: ${displayText(it.spec)}` : "",
        `Product ID: ${displayText(it.productId)}`,
        referenceQueries.length > 0
          ? `เบอร์ที่ลูกค้าค้นหา / Customer searched: ${referenceQueries.join(", ")}`
          : "",
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
}

function buildItemsHtml(items: MailQuoteItem[]) {
  const rows = items
    .map((it, idx) => {
      const referenceQueries = getRfqReferenceContexts(it.meta).map(
        (context) => context.searchQuery,
      );
      return `
        <tr>
          <td style="padding:0 0 12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #d9e2ec;background:#ffffff;font-family:${SYSTEM_FONT_STACK};">
              <tr>
                <td style="padding:12px 14px;border-bottom:1px solid #e5e7eb;background:#f8fafc;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                      <td style="padding:0 10px 0 0;vertical-align:top;font-size:13px;line-height:1.4;color:#64748b;overflow-wrap:anywhere;word-break:break-word;">
                        ลำดับ / Item ${idx + 1}
                      </td>
                      <td style="padding:0;text-align:right;vertical-align:top;font-size:16px;line-height:1.4;color:#111827;font-weight:700;overflow-wrap:anywhere;word-break:break-word;">
                        จำนวน / Qty: ${escapeHtml(it.qty)}
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:8px;">
                    <tr>
                      <td style="padding:0;font-size:18px;line-height:1.35;color:#0f172a;font-weight:700;overflow-wrap:anywhere;word-break:break-word;">
                        เบอร์สินค้า / Part No.: ${escapeHtml(displayText(it.partNo))}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:${SYSTEM_FONT_STACK};font-size:14px;line-height:1.5;">
                    <tr>
                      <td style="width:34%;padding:10px 12px;border-bottom:1px solid #eef2f7;color:#64748b;vertical-align:top;">แบรนด์ / Brand</td>
                      <td style="padding:10px 12px;border-bottom:1px solid #eef2f7;color:#111827;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(displayText(it.brand))}</td>
                    </tr>
                    <tr>
                      <td style="width:34%;padding:10px 12px;border-bottom:1px solid #eef2f7;color:#64748b;vertical-align:top;">ชื่อสินค้า / Product</td>
                      <td style="padding:10px 12px;border-bottom:1px solid #eef2f7;color:#111827;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(displayText(it.title))}</td>
                    </tr>
                    <tr>
                      <td style="width:34%;padding:10px 12px;color:#64748b;vertical-align:top;">หมวดหมู่ / Category</td>
                      <td style="padding:10px 12px;color:#111827;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(displayText(it.category))}</td>
                    </tr>
                    ${
                      referenceQueries.length > 0
                        ? `<tr>
                      <td style="width:34%;padding:10px 12px;border-top:1px solid #eef2f7;color:#64748b;vertical-align:top;">เบอร์ที่ลูกค้าค้นหา / Customer searched</td>
                      <td style="padding:10px 12px;border-top:1px solid #eef2f7;color:#0f3fb5;font-weight:700;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(referenceQueries.join(", "))}</td>
                    </tr>`
                        : ""
                    }
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:${SYSTEM_FONT_STACK};font-size:14px;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function isMissingProductRequestEmail(items: MailQuoteItem[]) {
  return items.length > 0 && items.every((item) => isMissingProductRequestItem(item));
}

function buildMissingProductRequestRows(item: MailQuoteItem) {
  const details = getMissingProductRequestItemDetails(item);
  if (!details) {
    return [];
  }

  return [
    ["Part No.", details.partNo],
    ["Filter Type", details.filterType],
    ["Brand", details.brand],
    ["Qty", details.qty ? String(details.qty) : null],
    ["Machine/Application", details.machineApplication],
    ["Note", details.note],
  ] as Array<[string, string | null]>;
}

function buildMissingProductRequestDimensionRows(item: MailQuoteItem) {
  const details = getMissingProductRequestItemDetails(item);
  if (!details) {
    return [];
  }

  return [
    ["OD", details.outerDiameter],
    ["ID", details.innerDiameter],
    ["Length/Height", details.lengthHeight],
    [
      "Thread System",
      getMissingProductThreadSystemLabel(details.threadSystem),
    ],
    ["Thread Size", details.threadSize],
    ["Gasket OD", details.gasketOD],
    ["Gasket ID", details.gasketID],
  ] as Array<[string, string | null]>;
}

function buildMissingProductRequestSourceRows(item: MailQuoteItem) {
  const details = getMissingProductRequestItemDetails(item);
  if (!details) {
    return [];
  }

  return [
    ["Search Query", details.searchQuery],
    ["Source Page", details.sourcePage],
    ["Locale", details.locale],
  ] as Array<[string, string | null]>;
}

function buildSectionText(title: string, rows: Array<[string, string | null]>) {
  const renderedRows = rows
    .map(([label, value]) => `- ${label}: ${displayText(value)}`)
    .join("\n");

  return `${title}\n${renderedRows}`;
}

function buildSectionHtml(title: string, rows: Array<[string, string | null]>) {
  const renderedRows = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="width:38%;padding:8px 10px;border-bottom:1px solid #eef2f7;color:#64748b;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(label)}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #eef2f7;color:#111827;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;">${escapeHtml(displayText(value))}</td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #d9e2ec;background:#ffffff;font-family:${SYSTEM_FONT_STACK};">
      <tr>
        <td style="padding:12px 14px;background:#f8fafc;border-bottom:1px solid #d9e2ec;">
          <h3 style="margin:0;font-size:15px;line-height:1.4;color:#111827;">${escapeHtml(title)}</h3>
        </td>
      </tr>
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:${SYSTEM_FONT_STACK};font-size:14px;line-height:1.5;">
            ${renderedRows}
          </table>
        </td>
      </tr>
    </table>
  `;
}

function buildEmailShell(body: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f3f4f6;margin:0;padding:0;font-family:${SYSTEM_FONT_STACK};color:#111827;line-height:1.6;">
      <tr>
        <td align="center" style="padding:18px 10px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;border-collapse:collapse;background:#ffffff;font-family:${SYSTEM_FONT_STACK};">
            <tr>
              <td style="padding:20px 16px;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function buildContactHtml() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:18px 0 0;font-family:${SYSTEM_FONT_STACK};font-size:14px;line-height:1.6;">
      <tr>
        <td style="padding:0 0 10px;color:#111827;overflow-wrap:anywhere;word-break:break-word;">
          Website: <a href="https://www.mrtsupplier.com" style="display:inline-block;padding:4px 0;color:#0f766e;text-decoration:underline;">${PUBLIC_WEBSITE}</a><br />
          Email: <a href="mailto:sales@mrtsupplier.com" style="display:inline-block;padding:4px 0;color:#0f766e;text-decoration:underline;">${PUBLIC_REPLY_TO_EMAIL}</a><br />
          Phone: <a href="tel:0815581323" style="display:inline-block;padding:4px 0;color:#0f766e;text-decoration:underline;">081-558-1323</a> / <a href="tel:0970122111" style="display:inline-block;padding:4px 0;color:#0f766e;text-decoration:underline;">097-012-2111</a><br />
          LINE Official: <strong>${PUBLIC_LINE_ID}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 0 0;">
          <a href="${PUBLIC_LINE_ADD_FRIEND_URL}" target="_blank" style="display:inline-block;background:#06C755;color:#ffffff;padding:12px 16px;min-height:44px;line-height:20px;text-decoration:none;font-weight:700;font-family:${SYSTEM_FONT_STACK};">
            ติดต่อผ่าน LINE Official: ${PUBLIC_LINE_ID} / Contact via LINE Official
          </a>
        </td>
      </tr>
    </table>
  `;
}

export async function sendAdminRfqEmail(args: {
  requestId: string;
  customer: MailCustomer;
  items: MailQuoteItem[];
}) {
  if (!isMailConfigured()) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const transporter = getTransporter();
  const { from, to, cc } = getMailEnv();
  const { requestId, customer, items } = args;
  const isMissingRequest = isMissingProductRequestEmail(items);

  const subject = isMissingRequest
    ? `[Missing Product Request] ${subjectPart(requestId)} ${subjectPart(
        customer.company || customer.name || "",
      )}`.trim()
    : `[RFQ] ${subjectPart(requestId)} ${subjectPart(
        customer.company || customer.name || "",
      )}`.trim();

  if (isMissingRequest) {
    const item = items[0];
    const details = getMissingProductRequestItemDetails(item);
    const requestTypeLabel = MISSING_PRODUCT_REQUEST_LABEL;
    const productRows = buildMissingProductRequestRows(item);
    const dimensionRows = buildMissingProductRequestDimensionRows(item);
    const contactRows = [
      ["Company", customer.company || null],
      ["Name", customer.name || null],
      ["Phone", customer.phone || null],
      ["Email", customer.email || null],
      ["LINE ID", customer.lineId || null],
      ["Contact Preference", customer.contactPref || null],
    ] as Array<[string, string | null]>;
    const sourceRows = buildMissingProductRequestSourceRows(item);
    const text = [
      "คำขอสินค้าที่ไม่พบจากเว็บไซต์",
      "Missing Product Request received from website",
      `Request ID: ${displayText(requestId)}`,
      "",
      buildSectionText("ประเภทคำขอ / Request Type", [["Type", requestTypeLabel]]),
      "",
      buildSectionText("ข้อมูลสินค้า / Product Information", productRows),
      "",
      buildSectionText(
        "ขนาด / Dimensions",
        dimensionRows.concat([
          [
            "Summary",
            details
              ? buildMissingProductRequestDimensionSummary(details)
              : item.spec || null,
          ],
        ]),
      ),
      "",
      buildSectionText("ช่องทางติดต่อ / Contact", contactRows),
      "",
      buildSectionText("แหล่งที่มา / Source / Search Context", sourceRows),
    ].join("\n");

    const html = buildEmailShell(`
        <h2 style="margin:0 0 6px;font-size:20px;line-height:1.35;color:#111827;">คำขอสินค้าที่ไม่พบจากเว็บไซต์</h2>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.45;color:#111827;">Missing Product Request received from website</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word;"><strong>Request ID:</strong> ${escapeHtml(displayText(requestId))}</p>
        ${buildSectionHtml("ประเภทคำขอ / Request Type", [["Type", requestTypeLabel]])}
        ${buildSectionHtml("ข้อมูลสินค้า / Product Information", productRows)}
        ${buildSectionHtml(
          "ขนาด / Dimensions",
          dimensionRows.concat([
            [
              "Summary",
              details
                ? buildMissingProductRequestDimensionSummary(details)
                : item.spec || null,
            ],
          ]),
        )}
        ${buildSectionHtml("ช่องทางติดต่อ / Contact", contactRows)}
        ${buildSectionHtml("แหล่งที่มา / Source / Search Context", sourceRows)}
        <p style="margin-top:20px;color:#6b7280;font-size:12px;line-height:1.5;">
          This email was generated automatically from mrt-supplier.com
        </p>
    `);

    try {
      return await transporter.sendMail({
        from,
        to,
        cc,
        replyTo: safeStr(customer.email) || PUBLIC_REPLY_TO_EMAIL,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error("[RFQ_MAIL] admin_send_failed", {
        ...getSafeMailDiagnostics(),
        error: error instanceof Error ? error.message : String(error),
        code: getErrorCode(error),
      });
      throw error;
    }
  }

  const contactRows = [
    ["Company", customer.company || null],
    ["Name", customer.name || null],
    ["Phone", customer.phone || null],
    ["Email", customer.email || null],
    ["LINE ID", customer.lineId || null],
    ["Contact Preference", customer.contactPref || null],
  ] as Array<[string, string | null]>;

  const text = [
    `คำขอใบเสนอราคาใหม่จากเว็บไซต์`,
    `New RFQ received from website`,
    `Request ID: ${displayText(requestId)}`,
    "",
    buildSectionText("ข้อมูลลูกค้า / Customer Information", contactRows),
    "",
    buildSectionText("หมายเหตุ / Note", [["Note", customer.note || null]]),
    "",
    `รายการสินค้า / Requested Items:`,
    buildItemsText(items),
  ].join("\n");

  const html = buildEmailShell(`
      <h2 style="margin:0 0 6px;font-size:20px;line-height:1.35;color:#111827;">คำขอใบเสนอราคาใหม่จากเว็บไซต์</h2>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.45;color:#111827;">New RFQ received from website</p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;overflow-wrap:anywhere;word-break:break-word;"><strong>Request ID:</strong> ${escapeHtml(displayText(requestId))}</p>

      ${buildSectionHtml("ข้อมูลลูกค้า / Customer Information", contactRows)}
      ${buildSectionHtml("หมายเหตุ / Note", [["Note", customer.note || null]])}

      <h3 style="margin:20px 0 12px;font-size:16px;line-height:1.4;color:#111827;">รายการสินค้า / Requested Items</h3>
      ${buildItemsHtml(items)}

      <p style="margin-top:20px;color:#6b7280;font-size:12px;line-height:1.5;">
        This email was generated automatically from mrt-supplier.com
      </p>
  `);

  try {
    return await transporter.sendMail({
      from,
      to,
      cc,
      replyTo: safeStr(customer.email) || PUBLIC_REPLY_TO_EMAIL,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[RFQ_MAIL] admin_send_failed", {
      ...getSafeMailDiagnostics(),
      error: error instanceof Error ? error.message : String(error),
      code: getErrorCode(error),
    });
    throw error;
  }
}

export async function sendCustomerRfqConfirmationEmail(args: {
  requestId: string;
  customer: MailCustomer;
  items: MailQuoteItem[];
}) {
  if (!isMailConfigured()) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const email = safeStr(args.customer.email);
  if (!email) {
    return null;
  }

  const transporter = getTransporter();
  const { from } = getMailEnv();
  const { requestId, customer, items } = args;
  const isMissingRequest = isMissingProductRequestEmail(items);
  const thaiCustomerName = buildThaiCustomerName(customer.name);
  const englishCustomerName = buildEnglishCustomerName(customer.name);

  const subject = isMissingRequest
    ? `เราได้รับคำขอสินค้าที่ไม่พบแล้ว / We received your Missing Product Request (${subjectPart(requestId)})`
    : `เราได้รับคำขอใบเสนอราคาแล้ว / We received your RFQ (${subjectPart(requestId)})`;
  const introTitle = isMissingRequest
    ? MISSING_PRODUCT_REQUEST_LABEL
    : "คำขอใบเสนอราคา / Request for Quotation";

  const text = [
    `เรียนคุณ ${thaiCustomerName},`,
    `ขอบคุณที่ติดต่อ MRT Supplier`,
    isMissingRequest
      ? `เราได้รับคำขอสินค้าที่ไม่พบของคุณแล้ว`
      : `ทีมงานได้รับคำขอใบเสนอราคาของคุณแล้ว`,
    isMissingRequest
      ? `ทีมงานจะตรวจสอบข้อมูลสินค้าและติดต่อกลับโดยเร็ว`
      : `และจะตรวจสอบรายการสินค้าเพื่อติดต่อกลับโดยเร็ว`,
    "",
    `Dear ${englishCustomerName},`,
    `Thank you for contacting MRT Supplier.`,
    isMissingRequest
      ? `We have received your missing product request.`
      : `We have received your request for quotation and will review the requested items before contacting you shortly.`,
    isMissingRequest
      ? `Our team will review the product information and contact you shortly.`
      : "",
    "",
    `Request ID: ${displayText(requestId)}`,
    "",
    isMissingRequest
      ? `${MISSING_PRODUCT_REQUEST_LABEL}:`
      : `รายการสินค้า / Requested Items:`,
    buildItemsText(items),
    "",
    `ช่องทางติดต่อ / Contact`,
    `Website: ${PUBLIC_WEBSITE}`,
    `Email: ${PUBLIC_REPLY_TO_EMAIL}`,
    `Phone: ${PUBLIC_PHONE}`,
    `LINE Official: ${PUBLIC_LINE_ID}`,
    `LINE Add Friend: ${PUBLIC_LINE_ADD_FRIEND_URL}`,
  ].join("\n");

  const thaiIntro = isMissingRequest
    ? `เราได้รับคำขอสินค้าที่ไม่พบของคุณแล้ว ทีมงานจะตรวจสอบข้อมูลสินค้าและติดต่อกลับโดยเร็ว`
    : `ทีมงานได้รับคำขอใบเสนอราคาของคุณแล้ว และจะตรวจสอบรายการสินค้าเพื่อติดต่อกลับโดยเร็ว`;
  const englishIntro = isMissingRequest
    ? `We have received your missing product request. Our team will review the product information and contact you shortly.`
    : `We have received your request for quotation and will review the requested items before contacting you shortly.`;

  const html = buildEmailShell(`
      <h2 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#111827;">${escapeHtml(introTitle)}</h2>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#111827;overflow-wrap:anywhere;word-break:break-word;">
        เรียนคุณ ${escapeHtml(thaiCustomerName)},<br />
        ขอบคุณที่ติดต่อ MRT Supplier<br />
        ${escapeHtml(thaiIntro)}
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#111827;overflow-wrap:anywhere;word-break:break-word;">
        Dear ${escapeHtml(englishCustomerName)},<br />
        Thank you for contacting MRT Supplier.<br />
        ${escapeHtml(englishIntro)}
      </p>

      ${buildSectionHtml("Request ID", [["Request ID", displayText(requestId)]])}

      <h3 style="margin:20px 0 12px;font-size:16px;line-height:1.4;color:#111827;">${
        isMissingRequest
          ? escapeHtml(MISSING_PRODUCT_REQUEST_LABEL)
          : "รายการสินค้า / Requested Items"
      }</h3>
      ${buildItemsHtml(items)}

      ${buildContactHtml()}

      <p style="margin-top:20px;font-size:14px;line-height:1.6;color:#111827;">ขอบคุณครับ/ค่ะ<br />Best regards,<br /><strong>MRT Supplier</strong></p>
  `);

  try {
    return await transporter.sendMail({
      from,
      to: email,
      replyTo: PUBLIC_REPLY_TO_EMAIL,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("[RFQ_MAIL] customer_send_failed", {
      ...getSafeMailDiagnostics(),
      error: error instanceof Error ? error.message : String(error),
      code: getErrorCode(error),
    });
    throw error;
  }
}
