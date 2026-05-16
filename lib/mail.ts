import nodemailer from "nodemailer";

function safeStr(v: unknown) {
  return String(v ?? "").trim();
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

function buildItemsText(items: MailQuoteItem[]) {
  return items
    .map((it, idx) => {
      const parts = [
        `${idx + 1}. ${it.partNo}`,
        it.brand ? `Brand: ${it.brand}` : "",
        it.title ? `Title: ${it.title}` : "",
        it.category ? `Category: ${it.category}` : "",
        `Qty: ${it.qty}`,
        it.spec ? `Spec: ${it.spec}` : "",
        `Product ID: ${it.productId}`,
      ].filter(Boolean);

      return parts.join(" | ");
    })
    .join("\n");
}

function buildItemsHtml(items: MailQuoteItem[]) {
  const rows = items
    .map((it, idx) => {
      return `
        <tr>
          <td style="padding:10px;border:1px solid #e5e5e5;">${idx + 1}</td>
          <td style="padding:10px;border:1px solid #e5e5e5;">${escapeHtml(it.partNo)}</td>
          <td style="padding:10px;border:1px solid #e5e5e5;">${escapeHtml(it.brand || "-")}</td>
          <td style="padding:10px;border:1px solid #e5e5e5;">${escapeHtml(it.title || "-")}</td>
          <td style="padding:10px;border:1px solid #e5e5e5;">${escapeHtml(it.category || "-")}</td>
          <td style="padding:10px;border:1px solid #e5e5e5;text-align:center;">${it.qty}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <thead>
        <tr style="background:#f7f7f7;">
          <th style="padding:10px;border:1px solid #e5e5e5;">#</th>
          <th style="padding:10px;border:1px solid #e5e5e5;">Part No</th>
          <th style="padding:10px;border:1px solid #e5e5e5;">Brand</th>
          <th style="padding:10px;border:1px solid #e5e5e5;">Title</th>
          <th style="padding:10px;border:1px solid #e5e5e5;">Category</th>
          <th style="padding:10px;border:1px solid #e5e5e5;">Qty</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
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

  const subject = `[RFQ] ${requestId} ${safeStr(
    customer.company || customer.name || ""
  )}`.trim();

  const text = [
    `New RFQ received`,
    `Request ID: ${requestId}`,
    "",
    `Company: ${safeStr(customer.company) || "-"}`,
    `Name: ${safeStr(customer.name) || "-"}`,
    `Phone: ${safeStr(customer.phone) || "-"}`,
    `Email: ${safeStr(customer.email) || "-"}`,
    `LINE ID: ${safeStr(customer.lineId) || "-"}`,
    `Contact Preference: ${safeStr(customer.contactPref) || "-"}`,
    `Note: ${safeStr(customer.note) || "-"}`,
    "",
    `Items:`,
    buildItemsText(items),
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
      <h2 style="margin:0 0 16px;">New RFQ received</h2>
      <p><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>

      <div style="margin:16px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;">
        <div><strong>Company:</strong> ${escapeHtml(customer.company || "-")}</div>
        <div><strong>Name:</strong> ${escapeHtml(customer.name || "-")}</div>
        <div><strong>Phone:</strong> ${escapeHtml(customer.phone || "-")}</div>
        <div><strong>Email:</strong> ${escapeHtml(customer.email || "-")}</div>
        <div><strong>LINE ID:</strong> ${escapeHtml(customer.lineId || "-")}</div>
        <div><strong>Contact Preference:</strong> ${escapeHtml(customer.contactPref || "-")}</div>
        <div><strong>Note:</strong> ${escapeHtml(customer.note || "-")}</div>
      </div>

      <h3 style="margin:20px 0 12px;">Requested Items</h3>
      ${buildItemsHtml(items)}

      <p style="margin-top:20px;color:#6b7280;font-size:12px;">
        This email was generated automatically from mrt-supplier.com
      </p>
    </div>
  `;

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

  const subject = `We received your RFQ (${requestId})`;

  const text = [
    `Dear ${safeStr(customer.name) || "Customer"},`,
    "",
    `Thank you for contacting MRT Supplier.`,
    `We have received your RFQ and our team will review it shortly.`,
    "",
    `Request ID: ${requestId}`,
    "",
    `Items:`,
    buildItemsText(items),
    "",
    `Website: www.mrtsupplier.com`,
    `Email: sales@mrtsupplier.com`,
    `Phone: 081-558-1323 / 097-012-2111`,
    `LINE Official: @mrtsupplier`,
    `LINE Add Friend: https://lin.ee/S676yYH`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
      <h2 style="margin:0 0 16px;">Thank you for your RFQ</h2>
      <p>Dear ${escapeHtml(customer.name || "Customer")},</p>
      <p>
        Thank you for contacting <strong>MRT Supplier</strong>. We have received your RFQ
        and our team will review it shortly.
      </p>

      <div style="margin:16px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fafafa;">
        <div><strong>Request ID:</strong> ${escapeHtml(requestId)}</div>
      </div>

      <h3 style="margin:20px 0 12px;">Requested Items</h3>
      ${buildItemsHtml(items)}

      <p style="margin-top:20px;">
        Website: <strong>www.mrtsupplier.com</strong><br />
        Email: <strong>sales@mrtsupplier.com</strong><br />
        Phone: <strong>081-558-1323 / 097-012-2111</strong>
      </p>

      <a
        href="https://lin.ee/S676yYH"
        target="_blank"
        style="display:inline-block;background:#06C755;color:#ffffff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:700;font-family:Arial,sans-serif;"
      >
        สอบถามผ่าน LINE Official: @mrtsupplier
      </a>

      <p style="font-size:13px;color:#666;margin-top:8px;">
        LINE Official: <strong>@mrtsupplier</strong>
      </p>

      <p style="margin-top:20px;">Best regards,<br /><strong>MRT Supplier</strong></p>
    </div>
  `;

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
