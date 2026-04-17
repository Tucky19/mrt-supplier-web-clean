import nodemailer from "nodemailer";

type QuoteItem = {
  id?: string;
  slug?: string;
  partNumber: string;
  brand?: string;
  name?: string;
  qty?: number;
};

type QuotePayload = {
  customerName: string;
  company?: string;
  email: string;
  phone?: string;
  notes?: string;
  items: QuoteItem[];
  quoteId?: string | number;
};

function escapeHtml(input: string) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(input: string) {
  return escapeHtml(input).replace(/\n/g, "<br />");
}

function buildItemsRows(items: QuoteItem[]) {
  return items
    .map((item, index) => {
      const qty = Math.max(1, Number(item.qty ?? 1) || 1);

      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;">
            ${index + 1}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;font-weight:600;">
            ${escapeHtml(item.partNumber || "-")}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;vertical-align:top;">
            ${escapeHtml(item.brand || "-")}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;vertical-align:top;">
            ${escapeHtml(item.name || "-")}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;text-align:right;">
            ${qty}
          </td>
        </tr>
      `;
    })
    .join("");
}

function buildItemsText(items: QuoteItem[]) {
  return items
    .map((item, index) => {
      const qty = Math.max(1, Number(item.qty ?? 1) || 1);

      return [
        `${index + 1}. ${item.partNumber || "-"}`,
        `   Brand: ${item.brand || "-"}`,
        `   Name: ${item.name || "-"}`,
        `   Qty: ${qty}`,
      ].join("\n");
    })
    .join("\n\n");
}

function customerHtml(payload: QuotePayload) {
  const itemsRows = buildItemsRows(payload.items);
  const companyLine = payload.company
    ? `<p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Company:</strong> ${escapeHtml(payload.company)}</p>`
    : "";
  const phoneLine = payload.phone
    ? `<p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Phone / LINE:</strong> ${escapeHtml(payload.phone)}</p>`
    : "";
  const notesBlock = payload.notes
    ? `
      <div style="margin-top:16px;padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;">
        <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:700;">Your notes</p>
        <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">${nl2br(payload.notes)}</p>
      </div>
    `
    : "";

  return `
  <div style="margin:0;padding:0;background:#f3f4f6;">
    <div style="max-width:720px;margin:0 auto;padding:32px 16px;">
      <div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:24px;background:#ffffff;">
        <div style="padding:28px 28px 20px;background:linear-gradient(135deg,#052e16 0%,#111827 100%);">
          <p style="margin:0 0 10px;color:#86efac;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">
            MRT Supplier
          </p>
          <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.25;">
            We received your quotation request
          </h1>
          <p style="margin:14px 0 0;color:#d1d5db;font-size:15px;line-height:1.7;">
            Thank you for contacting MRT Supplier. Our sales team is reviewing your requested items and will get back to you with pricing, availability, and lead time.
          </p>
        </div>

        <div style="padding:28px;">
          <div style="padding:18px 20px;border:1px solid #bbf7d0;border-radius:16px;background:#f0fdf4;">
            <p style="margin:0;color:#166534;font-size:14px;font-weight:700;">
              Expected response time: within 1 hour during business hours
            </p>
          </div>

          <div style="margin-top:24px;">
            <p style="margin:0 0 8px;color:#111827;font-size:16px;font-weight:700;">
              Contact details
            </p>
            <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Name:</strong> ${escapeHtml(payload.customerName)}</p>
            ${companyLine}
            <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
            ${phoneLine}
            ${
              payload.quoteId
                ? `<p style="margin:0;color:#374151;font-size:14px;"><strong>Reference:</strong> ${escapeHtml(String(payload.quoteId))}</p>`
                : ""
            }
          </div>

          ${notesBlock}

          <div style="margin-top:24px;">
            <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:700;">
              Requested items
            </p>

            <div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:16px;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">#</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Part Number</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Brand</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Description</th>
                    <th align="right" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top:24px;padding:18px 20px;border:1px solid #e5e7eb;border-radius:16px;background:#f9fafb;">
            <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:700;">Need urgent assistance?</p>
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">
              LINE: @mrt-supplier<br />
              Email: rfq01@mrtsupplier.com<br />
              Website: www.mrtsupplier.com
            </p>
          </div>
        </div>

        <div style="padding:18px 28px;border-top:1px solid #e5e7eb;background:#fafafa;">
          <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.7;">
            MRT Supplier Co., Ltd.<br />
            Reliable Industrial Parts Supplier
          </p>
        </div>
      </div>
    </div>
  </div>
  `;
}

function customerText(payload: QuotePayload) {
  return `
MRT Supplier

We received your quotation request.

Thank you for contacting MRT Supplier. Our sales team is reviewing your requested items and will get back to you with pricing, availability, and lead time.

Expected response time:
Within 1 hour during business hours

Contact details
Name: ${payload.customerName}
Company: ${payload.company || "-"}
Email: ${payload.email}
Phone / LINE: ${payload.phone || "-"}
Reference: ${payload.quoteId ? String(payload.quoteId) : "-"}

${payload.notes ? `Your notes:\n${payload.notes}\n` : ""}

Requested items
${buildItemsText(payload.items)}

Need urgent assistance?
LINE: @mrt-supplier
Email: rfq01@mrtsupplier.com
Website: www.mrtsupplier.com
  `.trim();
}

function salesHtml(payload: QuotePayload) {
  const itemsRows = buildItemsRows(payload.items);

  return `
  <div style="margin:0;padding:0;background:#f3f4f6;">
    <div style="max-width:760px;margin:0 auto;padding:24px 16px;">
      <div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:22px;background:#ffffff;">
        <div style="padding:24px 28px;background:#111827;">
          <p style="margin:0 0 8px;color:#86efac;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">
            New RFQ
          </p>
          <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.25;">
            New quotation request received
          </h1>
          <p style="margin:12px 0 0;color:#d1d5db;font-size:14px;line-height:1.7;">
            Please review and reply to this lead as soon as possible.
          </p>
        </div>

        <div style="padding:28px;">
          <div style="display:grid;grid-template-columns:1fr;gap:16px;">
            <div style="padding:18px;border:1px solid #e5e7eb;border-radius:16px;background:#f9fafb;">
              <p style="margin:0 0 10px;color:#111827;font-size:15px;font-weight:700;">Customer information</p>
              <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Name:</strong> ${escapeHtml(payload.customerName)}</p>
              <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Company:</strong> ${escapeHtml(payload.company || "-")}</p>
              <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
              <p style="margin:0 0 8px;color:#374151;font-size:14px;"><strong>Phone / LINE:</strong> ${escapeHtml(payload.phone || "-")}</p>
              <p style="margin:0;color:#374151;font-size:14px;"><strong>Reference:</strong> ${
                payload.quoteId ? escapeHtml(String(payload.quoteId)) : "-"
              }</p>
            </div>

            <div style="padding:18px;border:1px solid #e5e7eb;border-radius:16px;background:#f9fafb;">
              <p style="margin:0 0 10px;color:#111827;font-size:15px;font-weight:700;">Customer notes</p>
              <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">
                ${payload.notes ? nl2br(payload.notes) : "-"}
              </p>
            </div>
          </div>

          <div style="margin-top:24px;">
            <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:700;">
              Requested items
            </p>

            <div style="overflow:hidden;border:1px solid #e5e7eb;border-radius:16px;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f9fafb;">
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">#</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Part Number</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Brand</th>
                    <th align="left" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Description</th>
                    <th align="right" style="padding:12px;color:#6b7280;font-size:12px;border-bottom:1px solid #e5e7eb;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function salesText(payload: QuotePayload) {
  return `
New quotation request received

Customer information
Name: ${payload.customerName}
Company: ${payload.company || "-"}
Email: ${payload.email}
Phone / LINE: ${payload.phone || "-"}
Reference: ${payload.quoteId ? String(payload.quoteId) : "-"}

Customer notes:
${payload.notes || "-"}

Requested items
${buildItemsText(payload.items)}
  `.trim();
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "true") === "true";

  if (!host || !user || !pass) {
    throw new Error("Missing SMTP configuration.");
  }

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

export async function sendQuoteEmails(payload: QuotePayload) {
  const transporter = getTransporter();

  const rfqToEmail =
    process.env.RFQ_TO_EMAIL || process.env.SMTP_USER || "rfq01@mrtsupplier.com";

  const rfqCcEmail = process.env.RFQ_CC_EMAIL || "";
  const fromEmail =
    process.env.RFQ_FROM_EMAIL || process.env.SMTP_USER || "rfq01@mrtsupplier.com";

  const from = `"MRT Supplier" <${fromEmail}>`;

  const reference = payload.quoteId ? String(payload.quoteId) : "RFQ";
  const safeCustomerName = payload.customerName?.trim() || "Customer";

  const customerSubject = `[MRT Supplier] RFQ Received (${reference})`;
  const salesSubject = `New RFQ (${reference}) - ${safeCustomerName}${
    payload.company ? ` / ${payload.company}` : ""
  }`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: payload.email,
      subject: customerSubject,
      html: customerHtml(payload),
      text: customerText(payload),
      replyTo: rfqToEmail,
    }),
    transporter.sendMail({
      from,
      to: rfqToEmail,
      cc: rfqCcEmail || undefined,
      subject: salesSubject,
      html: salesHtml(payload),
      text: salesText(payload),
      replyTo: payload.email,
    }),
  ]);
}