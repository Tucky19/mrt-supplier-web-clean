import nodemailer from "nodemailer";

export type EmailRfqItem = {
  partNo: string;
  brand?: string | null;
  title?: string | null;
  qty: number;
  category?: string | null;
  spec?: string | null;
};

export type EmailRfqCustomer = {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  lineId?: string | null;
  note?: string | null;
  contactPref?: string | null;
};

export type EmailRfqPayload = {
  requestId: string;
  createdAt?: Date | string;
  customer: EmailRfqCustomer;
  items: EmailRfqItem[];
};

function env(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value?: Date | string) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildItemsTable(items: EmailRfqItem[]) {
  const rows = items
    .map((item: EmailRfqItem, index: number) => {
      const partNo = escapeHtml(item.partNo || "-");
      const brand = escapeHtml(item.brand || "-");
      const title = escapeHtml(item.title || "-");
      const qty = String(item.qty ?? 1);
      const category = escapeHtml(item.category || "-");

      return `
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;">${index + 1}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;font-weight:600;">${partNo}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${brand}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${title}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;text-align:right;">${qty}</td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${category}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">#</th>
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Part No</th>
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Brand</th>
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Title</th>
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:right;">Qty</th>
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Category</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "465"));
  const secure = env("SMTP_SECURE", "true") === "true";
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  if (!host || !port || !user || !pass) {
    throw new Error("SMTP config is incomplete.");
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
}

export async function sendAdminRfqEmail(payload: EmailRfqPayload) {
  const transporter = getTransporter();

  const to = env("RFQ_TO_EMAIL");
  const cc = env("RFQ_CC_EMAIL");
  const from = env("RFQ_FROM_EMAIL", env("SMTP_USER"));

  if (!to || !from) {
    throw new Error("RFQ email config is incomplete.");
  }

  const customer = payload.customer;
  const itemsTable = buildItemsTable(payload.items);
  const subject = `[RFQ] ${payload.requestId} - ${customer.company || customer.name}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.6;">
      <h2 style="margin:0 0 12px;">New RFQ Received</h2>
      <p style="margin:0 0 16px;">A new quotation request has been submitted from the website.</p>

      <div style="margin:0 0 20px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
        <p style="margin:0 0 6px;"><strong>Request ID:</strong> ${escapeHtml(payload.requestId)}</p>
        <p style="margin:0 0 6px;"><strong>Created:</strong> ${escapeHtml(formatDate(payload.createdAt))}</p>
        <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(customer.name || "-")}</p>
        <p style="margin:0 0 6px;"><strong>Company:</strong> ${escapeHtml(customer.company || "-")}</p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(customer.email || "-")}</p>
        <p style="margin:0 0 6px;"><strong>Phone:</strong> ${escapeHtml(customer.phone || "-")}</p>
        <p style="margin:0 0 6px;"><strong>LINE ID:</strong> ${escapeHtml(customer.lineId || "-")}</p>
        <p style="margin:0;"><strong>Preferred Contact:</strong> ${escapeHtml(customer.contactPref || "-")}</p>
      </div>

      ${
        customer.note
          ? `
        <div style="margin:0 0 20px;">
          <h3 style="margin:0 0 8px;">Customer Note</h3>
          <div style="padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;">
            ${escapeHtml(customer.note)}
          </div>
        </div>
      `
          : ""
      }

      <div style="margin:0 0 20px;">
        <h3 style="margin:0 0 10px;">Requested Items</h3>
        ${itemsTable}
      </div>
    </div>
  `;

  const text = [
    "New RFQ Received",
    `Request ID: ${payload.requestId}`,
    `Created: ${formatDate(payload.createdAt)}`,
    `Name: ${customer.name || "-"}`,
    `Company: ${customer.company || "-"}`,
    `Email: ${customer.email || "-"}`,
    `Phone: ${customer.phone || "-"}`,
    `LINE ID: ${customer.lineId || "-"}`,
    `Preferred Contact: ${customer.contactPref || "-"}`,
    customer.note ? `Note: ${customer.note}` : "",
    "",
    "Items:",
    ...payload.items.map(
      (item: EmailRfqItem, index: number) =>
        `${index + 1}. ${item.partNo} | ${item.brand || "-"} | ${item.title || "-"} | Qty: ${item.qty}`
    ),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    return await transporter.sendMail({
      from,
      to,
      cc: cc || undefined,
      subject,
      html,
      text,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Admin email failed:", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    throw error;
  }
}

export async function sendCustomerRfqConfirmationEmail(payload: EmailRfqPayload) {
  const transporter = getTransporter();

  const from = env("RFQ_FROM_EMAIL", env("SMTP_USER"));
  const to = payload.customer.email?.trim();

  if (!to || !from) {
    return null;
  }

  const customerName = payload.customer.name || "Customer";
  const subject = `We received your RFQ - ${payload.requestId}`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.7;">
      <h2 style="margin:0 0 12px;">Thank you for your quotation request</h2>
      <p style="margin:0 0 14px;">Dear ${escapeHtml(customerName)},</p>
      <p style="margin:0 0 14px;">
        We have received your RFQ and our team will review the requested items and contact you shortly.
      </p>

      <div style="margin:0 0 18px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
        <p style="margin:0 0 6px;"><strong>Request ID:</strong> ${escapeHtml(payload.requestId)}</p>
        <p style="margin:0;"><strong>Total Items:</strong> ${payload.items.length}</p>
      </div>

      <p style="margin:0 0 14px;">
        If your request is urgent, you may contact us directly by email or LINE.
      </p>

      <p style="margin:0;">
        Best regards,<br />
        MRT Supplier
      </p>
    </div>
  `;

  const text = [
    `Dear ${customerName},`,
    "",
    "We have received your RFQ and our team will contact you shortly.",
    `Request ID: ${payload.requestId}`,
    `Total Items: ${payload.items.length}`,
    "",
    "Best regards,",
    "MRT Supplier",
  ].join("\n");

  try {
    return await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
  } catch (error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Customer email failed:", {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    throw error;
  }
}