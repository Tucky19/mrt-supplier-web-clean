import type { Metadata } from "next";
import { CircleAlert, Lightbulb, MessageCircle, SearchX } from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

const LINE_URL = "https://lin.ee/S676yYH";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai
      ? "ติชมการใช้งานเว็บไซต์"
      : "Website Feedback",
    description: isThai
      ? "ส่งปัญหาหรือข้อเสนอแนะเกี่ยวกับการค้นหาและข้อมูลสินค้าผ่าน LINE Official ของ MRT Supplier"
      : "Send website search issues, product-data corrections, or suggestions through MRT Supplier LINE Official.",
    alternates: {
      canonical: `/${locale}/feedback`,
      languages: {
        th: "/th/feedback",
        en: "/en/feedback",
        "x-default": "/th/feedback",
      },
    },
  };
}

export default async function FeedbackPage({ params }: PageProps) {
  const { locale } = await params;
  const isThai = locale === "th";
  const topics = isThai
    ? [
        {
          icon: SearchX,
          title: "ค้นหาสินค้าไม่เจอ",
          body: "ส่ง Part Number คำค้นหา หรือภาพหน้าจอที่ค้นหาไม่พบ",
        },
        {
          icon: CircleAlert,
          title: "ข้อมูลสินค้าอาจไม่ถูกต้อง",
          body: "แจ้ง Part Number และข้อมูลที่ต้องการให้ทีมตรวจสอบ เช่น รูป ขนาด หรือเบอร์เทียบ",
        },
        {
          icon: Lightbulb,
          title: "ข้อเสนอแนะการใช้งาน",
          body: "บอกหน้าที่ใช้งาน สิ่งที่ทำได้ยาก และรูปแบบที่ต้องการให้ปรับปรุง",
        },
      ]
    : [
        {
          icon: SearchX,
          title: "Could not find a product",
          body: "Send the Part Number, search term, or a screenshot of the missing result.",
        },
        {
          icon: CircleAlert,
          title: "Product information may be incorrect",
          body: "Share the Part Number and the image, dimension, or cross-reference that needs review.",
        },
        {
          icon: Lightbulb,
          title: "Website suggestion",
          body: "Tell us which page you used, what was difficult, and what would make it easier.",
        },
      ];

  return (
    <main className="mrt-blueprint-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text)]">
      <SiteHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
            {isThai ? "ช่วยเราปรับปรุงเว็บไซต์" : "Help us improve"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {isThai ? "ติชมการใช้งานเว็บไซต์" : "Website feedback"}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
            {isThai
              ? "หากค้นหาไม่พบ พบข้อมูลที่ควรแก้ไข หรือมีข้อเสนอแนะ ส่งข้อความและภาพหน้าจอผ่าน LINE ได้โดยตรง ทีมงานจะนำไปตรวจสอบและปรับปรุง"
              : "If you cannot find a product, notice information that needs correction, or have a suggestion, send a message and screenshot through LINE for our team to review."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mrt-radius-md)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-base font-semibold">{topic.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {topic.body}
                </p>
              </article>
            );
          })}
        </div>

        <section className="mt-6 rounded-[var(--mrt-radius-lg)] border border-[#06C755] bg-[var(--color-success-soft)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-success-text)]">
                {isThai ? "ส่งติชมทาง LINE Official" : "Send feedback on LINE Official"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                {isThai
                  ? "เพื่อให้ตรวจสอบได้เร็ว กรุณาส่งภาพหน้าจอ ลิงก์หน้าที่พบปัญหา และรายละเอียดสั้น ๆ ไม่จำเป็นต้องส่งอีเมล"
                  : "For faster review, include a screenshot, the page link, and a short description. No email is required."}
              </p>
            </div>

            <TrackedLineLink
              href={LINE_URL}
              source="feedback_page"
              locale={locale}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--mrt-radius-md)] bg-[#06C755] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#05ad49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {isThai ? "เปิด LINE เพื่อติชม" : "Open LINE to send feedback"}
            </TrackedLineLink>
          </div>
        </section>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}
