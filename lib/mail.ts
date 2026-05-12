import nodemailer from "nodemailer";

function safeStr(v: unknown) {
  return String(v ?? "").trim();
}

function getMailEnv() {
  const host = safeStr(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    safeStr(process.env.SMTP_SECURE).toLowerCase() === "true";
  const user = safeStr(process.env.SMTP_USER);
  const pass = safeStr(process.env.SMTP_PASS);
  const to = safeStr(process.env.RFQ_TO_EMAIL || user);
  const cc = safeStr(process.env.RFQ_CC_EMAIL || "");
  const from = safeStr(process.env.RFQ_FROM_EMAIL || user);

  return {
    host,
    port,
    secure,
    user,
    pass,
    to,
    cc,
    from,
  };
}

export function isMailConfigured() {
  const { host, port, user, pass, to, from } = getMailEnv();

  return !!(
    host &&
    port &&
    user &&
    pass &&
    to &&
    from
  );
}

function getTransporter() {
  const { host, port, secure, user, pass, from, to, cc } = getMailEnv();

  console.info("[RFQ_MAIL] env_check", {
    host,
    port,
    secure,
    user,
    hasPass: Boolean(pass),
    passLen: pass?.length ?? 0,
    from,
    to,
    cc,
  });

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
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

  return transporter.sendMail({
    from,
    to,
    cc: cc || undefined,
    replyTo: customer.email || undefined,
    subject,
    text,
    html,
  });
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
    `Email: rfq@mrtsupplier.com`,
    `Phone: 081-5581323, 097-0122111`,
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
        Email: <strong>rfq@mrtsupplier.com</strong><br />
        Phone: <strong>081-5581323, 097-0122111</strong>
      </p>

      <p style="margin-top:20px;">Best regards,<br /><strong>MRT Supplier</strong></p>
    </div>
  `;

  return transporter.sendMail({
    from,
    to: email,
    subject,
    text,
    html,
  });
}
