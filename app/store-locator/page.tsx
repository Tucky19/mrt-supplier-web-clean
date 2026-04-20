import type { Metadata } from "next";
import { useLocale } from "next-intl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store Locator | MRT Supplier",
  description:
    "Find MRT Supplier store location, business hours, and contact details for industrial bearings & filters procurement.",
};

const STORE = {
  name: "MRT Supplier",
  addressLine: "YOUR_ADDRESS_LINE", // ใส่ที่อยู่จริง
  city: "Thailand",
  phone: "YOUR_PHONE",
  email: "YOUR_EMAIL",
  hours: [
    { day: "Mon–Fri", time: "08:30–17:30" },
    { day: "Sat", time: "09:00–15:00" },
    { day: "Sun", time: "Closed" },
  ],
  // ใส่ลิงก์ Google Maps share/embed ของคุณ
  // วิธีง่าย: ไป Google Maps → ค้นร้าน → Share → Embed a map → copy src
  mapEmbedSrc:
    "https://www.google.com/maps?q=Bangkok&output=embed",
};

export default function StoreLocatorPage() {
  const locale = useLocale();
  const jsonLd = {
    "@contexs": "https://schema.org",
    "@type": "LocalBusiness",
    name: STORE.name,
    description:
      "Industrial bearings & filters supplier. Stock-ready, cross reference, RFQ-based procurement.",
    telephone: STORE.phone,
    email: STORE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: STORE.addressLine,
      addressCountry: "TH",
    },
    openingHoursSpecification: STORE.hours
      .filter((h) => h.time !== "Closed")
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.day, // แบบง่าย (พอใช้ SEO ได้) ถ้าจะเป๊ะค่อยทำ mapping ทีหลัง
        opens: h.time.split("–")[0],
        closes: h.time.split("–")[1],
      })),
  };

  return (
    <main className="bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-xs font-semibold text-gray-600">Local pickup / Visit</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Store Locator
          </h1>
          <p className="mt-4 max-w-2xl text-base text-gray-600">
            สำหรับลูกค้าที่ต้องการเข้ามาดูของจริง หรือรับสินค้าใกล้พื้นที่
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border bg-white">
                <div className="border-b px-5 py-4">
                  <div className="text-sm font-semibold">Map</div>
                  <div className="text-xs text-gray-600">
                    Open in Google Maps for directions
                  </div>
                </div>
                <div className="aspect-[16/10] w-full">
                  <iframe
                    src={STORE.mapEmbedSrc}
                    className="h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            <aside className="lg:col-span-5">
              <div className="space-y-4">
                <div className="rounded-2xl border bg-white p-6">
                  <div className="text-sm font-semibold">{STORE.name}</div>
                  <div className="mt-2 text-sm text-gray-700">
                    {STORE.addressLine}
                  </div>

                  <div className="mt-4 grid gap-2 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-semibold">{STORE.phone}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold">{STORE.email}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border bg-gray-50 p-4">
                    <div className="text-xs font-semibold text-gray-700">
                      Business hours
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      {STORE.hours.map((h) => (
                        <div key={h.day} className="flex justify-between">
                          <span className="text-gray-600">{h.day}</span>
                          <span className="font-semibold">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-6">
                  <div className="text-sm font-semibold">For factories</div>
                  <p className="mt-2 text-sm text-gray-600">
                    แนะนำให้ค้นหา Part No แล้วส่ง RFQ เพื่อให้ทีมงานยืนยันสเปกและเสนอราคาเร็วที่สุด
                  </p>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`/${locale}/products`}
                      className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Search parts
                    </a>
                    <a
                      href={`/quote`}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                    >
                      Request RFQ
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
