import Link from "next/link";
import {
  Building2,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  SearchCheck,
} from "lucide-react";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";

type Props = {
  params: Promise<{ locale: string }>;
};

const LINE_URL = "https://lin.ee/R3vfZW0";
const PHONE_PRIMARY = "097-0122111";
const PHONE_SECONDARY = "081-5581323";
const PHONE_LINK = "tel:+66970122111";

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const isThai = locale === "th";

  return (
    <main className="min-h-screen bg-slate-50">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              MRT Supplier Co., Ltd.
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 lg:text-5xl">
              {isThai
                ? "ติดต่อทีมขายและจัดหาอะไหล่ Industrial Supply"
                : "Contact our industrial supply and sourcing team"}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              สอบถามสินค้า, Part Number, Cross Reference และขอใบเสนอราคาได้โดยตรง
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {isThai ? "ข้อมูลบริษัท" : "Company Identity"}
                  </h2>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-950">
                        บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด
                      </p>
                      <p>MRT Supplier Co., Ltd.</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Tax ID</p>
                        <p>0103557011754</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {isThai ? "ที่อยู่บริษัท" : "Company Address"}
                        </p>
                        <p>
                          เลขที่ 15 ชั้น 2 ซอยบรมราชชนนี แขวงตลิ่งชัน
                          เขตตลิ่งชัน กรุงเทพมหานคร 10170
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {isThai ? "เบอร์โทร" : "Phone"}
                        </p>
                        <p>
                          {PHONE_PRIMARY}, {PHONE_SECONDARY}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <SearchCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {isThai ? "ส่งข้อมูลอะไรมาได้บ้าง" : "What to Send"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {isThai
                      ? "ถ้ามีข้อมูลเบื้องต้นเหล่านี้ ทีมงานจะช่วยเช็กสินค้าและตอบกลับได้เร็วขึ้น"
                      : "These details help our team check the right product and respond faster."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Part Number",
                      "Cross Reference",
                      "Description / Specification",
                      "photos",
                      "quantity",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    {isThai
                      ? "ถ้ามี product list หรือ BOM สามารถส่งพร้อมกันได้เลย โดยเฉพาะงานซ่อมบำรุง, งานจัดซื้อ และงานเทียบแทนอะไหล่"
                      : "You can also send a product list or BOM, especially for maintenance, procurement, or replacement parts."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                {isThai ? "Quick Actions" : "Quick Actions"}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {isThai
                  ? "เลือกช่องทางติดต่อที่สะดวกได้เลย"
                  : "Choose the contact channel that works best"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {isThai
                  ? "ถ้าพร้อมส่งรายการสินค้าแล้ว สามารถเปิดใบขอราคา (RFQ), คุยผ่าน LINE หรือโทรคุยกับทีมงานได้ทันที"
                  : "If your list is ready, open the RFQ page, chat on LINE, or call our team directly."}
              </p>

              <div className="mt-6 space-y-4">
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border border-emerald-300 bg-emerald-50 p-5 transition hover:border-emerald-400 hover:bg-emerald-100"
                >
                  <p className="text-sm font-semibold text-emerald-800">LINE</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-950">
                    {isThai ? "ส่งรายการทาง LINE" : "Chat on LINE"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                    {isThai
                      ? "ส่ง Part Number, รูปสินค้า, product list หรือข้อมูลหน้างานมาให้ทีมงานเช็กต่อได้ทันที"
                      : "Send part numbers, photos, or a product list directly to our team."}
                  </p>
                </a>

                <Link
                  href={`/${locale}/quote`}
                  className="block rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white transition hover:bg-slate-800"
                >
                  <p className="text-sm font-semibold text-slate-200">RFQ</p>
                  <p className="mt-2 text-lg font-semibold">
                    {isThai ? "เปิดใบขอราคา (RFQ)" : "Open RFQ Page"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {isThai
                      ? "เหมาะสำหรับส่งรายการสินค้าและข้อมูลติดต่อเพื่อให้ทีมงานเสนอราคา"
                      : "Best for sending your product list and contact details for quotation."}
                  </p>
                </Link>

                <a
                  href={PHONE_LINK}
                  className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
                >
                  <p className="text-sm font-semibold text-slate-700">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {PHONE_PRIMARY}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {PHONE_SECONDARY}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {isThai
                      ? "เหมาะสำหรับงานด่วน, follow-up ใบเสนอราคา และการเช็ก availability เบื้องต้น"
                      : "Best for urgent requests, quotation follow-up, and availability checks."}
                  </p>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
