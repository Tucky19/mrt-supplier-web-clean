const MRT_SUPPLIER_EMAIL_LOGO_URL =
  "https://mrtsupplier.com/images/email/mrt-supplier-logo.png";

const MRT_SUPPLIER_LINE_URL = "https://lin.ee/S676yYH";
const MRT_SUPPLIER_WEBSITE_URL = "https://mrtsupplier.com";

export const COLD_INTRODUCTION_EMAIL_SUBJECT =
  "ลดเวลาหาอะไหล่โรงงาน พร้อมช่วยเทียบสเปก";

export type ColdIntroductionEmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildColdIntroductionEmailTemplate(): ColdIntroductionEmailTemplate {
  const subject = COLD_INTRODUCTION_EMAIL_SUBJECT;

  const html = `
    <div style="margin:0;padding:0;background-color:#f3f4f6;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;padding:24px 0;background-color:#f3f4f6;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;">
              <tr>
                <td align="center" style="padding:32px 24px 20px 24px;background-color:#ffffff;border-bottom:1px solid #e5e7eb;">
                  <img
                    src="${escapeHtml(MRT_SUPPLIER_EMAIL_LOGO_URL)}"
                    alt="MRT Supplier"
                    width="220"
                    style="display:block;width:220px;max-width:100%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;"
                  />
                </td>
              </tr>

              <tr>
                <td style="padding:32px 32px 16px 32px;font-family:Arial,Helvetica,sans-serif;color:#111827;line-height:1.7;">
                  <p style="margin:0 0 16px 0;font-size:16px;">เรียน ทีมจัดซื้อ / ผู้เกี่ยวข้อง</p>

                  <p style="margin:0 0 16px 0;font-size:15px;color:#374151;">
                    ขออนุญาตแนะนำ MRT Supplier Co., Ltd.<br />
                    เราจัดหาอะไหล่เครื่องจักรโรงงาน เช่น แบริ่ง และไส้กรองอุตสาหกรรม สำหรับฝ่ายจัดซื้อและทีมซ่อมบำรุง
                  </p>

                  <p style="margin:0 0 12px 0;font-size:15px;color:#111827;font-weight:700;">
                    เราช่วยให้งานจัดซื้อง่ายขึ้นด้วย:
                  </p>

                  <ul style="margin:0 0 20px 20px;padding:0;color:#374151;font-size:15px;">
                    <li style="margin:0 0 8px 0;">ช่วยค้นหาและเทียบเบอร์อะไหล่ / Cross Reference เบื้องต้น</li>
                    <li style="margin:0 0 8px 0;">รองรับแบรนด์อุตสาหกรรม เช่น Donaldson, MANN-FILTER, NTN</li>
                    <li style="margin:0 0 8px 0;">เน้นสินค้าแท้ / สินค้าตรงสเปก</li>
                    <li style="margin:0;">ส่งใบเสนอราคาได้รวดเร็วตามรายการที่ลูกค้าต้องการ</li>
                  </ul>

                  <p style="margin:0 0 24px 0;font-size:15px;color:#374151;">
                    หากสะดวก ผมขอส่งข้อมูลสินค้าเบื้องต้นให้ดู หรือขอนัดโทรคุยสั้นๆ ประมาณ 5 นาทีครับ
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px 0;">
                    <tr>
                      <td align="center" style="padding:0 0 12px 0;">
                        <a
                          href="${escapeHtml(MRT_SUPPLIER_LINE_URL)}"
                          target="_blank"
                          style="display:inline-block;background-color:#06c755;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;padding:12px 24px;border-radius:10px;"
                        >
                          เพิ่มเพื่อนทาง LINE
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <a
                          href="${escapeHtml(MRT_SUPPLIER_WEBSITE_URL)}"
                          target="_blank"
                          style="display:inline-block;background-color:#0f172a;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;padding:12px 24px;border-radius:10px;"
                        >
                          เยี่ยมชมเว็บไซต์
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 32px 32px;font-family:Arial,Helvetica,sans-serif;">
                  <div style="border:1px solid #e5e7eb;border-radius:14px;background-color:#f8fafc;padding:20px;">
                    <p style="margin:0 0 10px 0;color:#111827;font-size:15px;font-weight:700;">Contact</p>
                    <p style="margin:0;color:#374151;font-size:14px;line-height:1.8;">
                      MRT Supplier Co., Ltd.<br />
                      โทร: 097 012 2111 / 081 558 1323<br />
                      LINE: @mrtsupplier<br />
                      เว็บไซต์: <a href="${escapeHtml(MRT_SUPPLIER_WEBSITE_URL)}" target="_blank" style="color:#0f4c81;text-decoration:underline;">https://mrtsupplier.com</a>
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `.trim();

  const text = [
    "เรียน ทีมจัดซื้อ / ผู้เกี่ยวข้อง",
    "",
    "ขออนุญาตแนะนำ MRT Supplier Co., Ltd.",
    "เราจัดหาอะไหล่เครื่องจักรโรงงาน เช่น แบริ่ง และไส้กรองอุตสาหกรรม สำหรับฝ่ายจัดซื้อและทีมซ่อมบำรุง",
    "",
    "เราช่วยให้งานจัดซื้อง่ายขึ้นด้วย:",
    "- ช่วยค้นหาและเทียบเบอร์อะไหล่ / Cross Reference เบื้องต้น",
    "- รองรับแบรนด์อุตสาหกรรม เช่น Donaldson, MANN-FILTER, NTN",
    "- เน้นสินค้าแท้ / สินค้าตรงสเปก",
    "- ส่งใบเสนอราคาได้รวดเร็วตามรายการที่ลูกค้าต้องการ",
    "",
    "หากสะดวก ผมขอส่งข้อมูลสินค้าเบื้องต้นให้ดู หรือขอนัดโทรคุยสั้นๆ ประมาณ 5 นาทีครับ",
    "",
    `LINE: ${MRT_SUPPLIER_LINE_URL}`,
    `เว็บไซต์: ${MRT_SUPPLIER_WEBSITE_URL}`,
    "",
    "Contact",
    "MRT Supplier Co., Ltd.",
    "โทร: 097 012 2111 / 081 558 1323",
    "LINE: @mrtsupplier",
    "เว็บไซต์: https://mrtsupplier.com",
  ].join("\n");

  return {
    subject,
    html,
    text,
  };
}
