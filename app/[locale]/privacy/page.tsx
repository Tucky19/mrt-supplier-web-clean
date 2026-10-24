import type { Metadata } from "next";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy",
    description: isThai
      ? "ข้อมูลเกี่ยวกับการเก็บ ใช้ และดูแลข้อมูลส่วนบุคคลบนเว็บไซต์ MRT Supplier"
      : "How MRT Supplier collects, uses, and protects personal information submitted through this website.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        th: "/th/privacy",
        en: "/en/privacy",
        "x-default": "/th/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const isThai = locale === "th";
  const sections = isThai
    ? [
        {
          title: "ข้อมูลที่เราเก็บ",
          body: "เมื่อคุณส่ง RFQ หรือติดต่อเรา เราอาจเก็บชื่อ บริษัท โทรศัพท์ อีเมล LINE ID รายการสินค้า Part Number จำนวน รุ่นเครื่องจักร และข้อความที่คุณส่ง นอกจากนี้เว็บไซต์อาจเก็บข้อมูลการใช้งาน เช่น หน้าที่เข้าชม คำค้นหา แหล่งที่มาของผู้เข้าชม และการกดปุ่มสำคัญตามการตั้งค่าคุกกี้ของคุณ",
        },
        {
          title: "วัตถุประสงค์การใช้ข้อมูล",
          body: "เราใช้ข้อมูลเพื่อพิจารณาและตอบกลับ RFQ จัดหาสินค้า ติดต่อกลับ ปรับปรุงการค้นหาและประสบการณ์ใช้งาน รักษาความปลอดภัยของระบบ และวัดผลการตลาดสำหรับการหาลูกค้าใหม่",
        },
        {
          title: "คุกกี้และการวิเคราะห์",
          body: "เว็บไซต์ใช้เทคโนโลยีที่จำเป็นต่อการทำงาน และอาจใช้ Google Analytics หรือ Google Tag Manager เพื่อวัดการใช้งานเมื่อคุณอนุญาต คุณสามารถยอมรับ ปฏิเสธ หรือเปลี่ยนการตั้งค่าคุกกี้ได้จากปุ่มตั้งค่าคุกกี้บนเว็บไซต์",
        },
        {
          title: "การเปิดเผยและการเก็บรักษา",
          body: "เราอาจให้ผู้ให้บริการระบบเว็บไซต์ ฐานข้อมูล อีเมล และการวิเคราะห์ประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการ เราไม่ขายข้อมูลส่วนบุคคล และจะเก็บข้อมูลตามระยะเวลาที่จำเป็นต่อ RFQ การติดต่อ ธุรกรรม และข้อกำหนดที่เกี่ยวข้อง",
        },
        {
          title: "สิทธิและการติดต่อ",
          body: "หากต้องการสอบถาม ขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลที่เกี่ยวข้องกับคุณ ติดต่อ sales@mrtsupplier.com หรือโทร 097 012 2111 เราอาจขอข้อมูลเพื่อยืนยันตัวตนก่อนดำเนินการ",
        },
      ]
    : [
        {
          title: "Information we collect",
          body: "When you submit an RFQ or contact us, we may collect your name, company, phone number, email, LINE ID, product list, part numbers, quantities, machine details, and message. Depending on your cookie choices, the website may also collect usage data such as visited pages, search terms, traffic source, and important button interactions.",
        },
        {
          title: "How we use information",
          body: "We use information to review and respond to RFQs, source products, contact you, improve search and website usability, protect the service, and measure new-customer marketing performance.",
        },
        {
          title: "Cookies and analytics",
          body: "The website uses technology required for core operation and may use Google Analytics or Google Tag Manager for measurement when you allow it. You can accept, reject, or revisit your cookie choice using the cookie settings control on the website.",
        },
        {
          title: "Service providers and retention",
          body: "Website, database, email, and analytics providers may process information only as needed to support the service. We do not sell personal information. We retain data only as needed for RFQs, communication, transactions, security, and applicable requirements.",
        },
        {
          title: "Your choices and contact",
          body: "To ask about, access, correct, or request deletion of personal information associated with you, contact sales@mrtsupplier.com or call +66 97 012 2111. We may need to verify your identity before completing a request.",
        },
      ];

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <SiteHeader locale={locale} />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {isThai ? "ข้อมูลและความเป็นส่วนตัว" : "Data and privacy"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
          {isThai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy"}
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          {isThai ? "ปรับปรุงล่าสุด: 20 ตุลาคม 2026" : "Last updated: October 20, 2026"}
        </p>

        <div className="mt-8 space-y-4">
          <section className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">{isThai ? "การวัดผลโฆษณา Meta" : "Meta advertising measurement"}</h2>
            <p className="mt-2 text-sm leading-7">{isThai ? "เมื่อคุณยอมรับคุกกี้วิเคราะห์และการตลาด เราอาจส่งเหตุการณ์การใช้งานที่กำหนดไว้ เช่น การดูสินค้า การเพิ่มรายการขอราคา และ RFQ ที่สำเร็จ ผ่านเซิร์ฟเวอร์ของ MRT ไปยัง Meta (Facebook) Conversions API ข้อมูลประกอบด้วยประเภทอุปกรณ์/เบราว์เซอร์ (User Agent) รหัสสุ่ม _fbp และ _fbc เมื่อมีรหัสคลิกจากลิงก์ Meta จริง รวมถึง URL ที่ตัด query และ hash แล้ว กับรหัสสินค้าสาธารณะ การใช้งานช่องทางวัดผลนี้ออกแบบไม่ให้ส่งชื่อ อีเมล โทรศัพท์ บริษัท ที่อยู่ LINE ID ข้อความที่คุณกรอก หรือ client IP รหัส _fbp เป็นคุกกี้ first-party อายุไม่เกิน 90 วัน ส่วนรหัสคลิกที่ derive ขึ้นใหม่ใช้ในหน่วยความจำของหน้าเท่านั้น MRT ไม่บันทึกรหัสเหล่านี้หรือ User Agent ลงฐานข้อมูล RFQ เมื่อปฏิเสธ ระบบจะหยุดส่งและพยายามลบ _fbp ที่เว็บไซต์ควบคุมได้ Meta ประมวลผลข้อมูลตามนโยบายของ Meta โปรดอ่านรายละเอียดและใช้ cookie settings เพื่อเปลี่ยนความยินยอม" : "After you accept analytics and advertising cookies, MRT may send defined activity events, such as product views, additions to a quote list and successful RFQs, through its server to Meta (Facebook) Conversions API for measurement, attribution and advertising effectiveness. Data includes device/browser User Agent, the random _fbp identifier, _fbc when a genuine Meta click identifier is available, query/hash-free page URLs and public product identifiers. This implementation is designed not to send your name, email, phone, company, address, LINE ID, entered text or client IP. The first-party _fbp cookie lasts up to 90 days; a newly derived click identifier is kept in page memory only. MRT does not store these identifiers or User Agent in its RFQ database. Rejecting consent stops transmission and attempts to remove the _fbp cookie controlled by this site. Meta processes received data under its own privacy policy. Use cookie settings to change your consent."}</p>
            <a href="https://www.facebook.com/privacy/policy/" className="underline">Meta Privacy Policy</a>
          </section>
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
            >
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </section>
      <SiteFooter locale={locale} />
    </main>
  );
}
