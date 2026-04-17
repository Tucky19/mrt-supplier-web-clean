import Image from "next/image";
import Link from "next/link";
import SingleSearch from "@/components/search/SingleSearch";

export default function Hero() {
  return (
    <section className="border-b border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Industrial Parts Supplier Platform
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            ค้นหาอะไหล่อุตสาหกรรมได้รวดเร็ว
            <br className="hidden sm:block" />
            ด้วย Part Number และ Cross Reference
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            ค้นหาไส้กรองและตลับลูกปืนด้วยรหัสสินค้า เบอร์เทียบ หรือรุ่นเครื่องจักร
            รองรับแบรนด์หลัก เช่น NTN, Donaldson และ MANN-FILTER พร้อมระบบขอใบเสนอราคา
            (RFQ) สำหรับงานจัดซื้อ
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <SingleSearch autoFocus={false} />
          </div>

          <div className="mt-3 text-sm text-neutral-400">
            ตัวอย่าง: P550148, LF3349, 6205, 6308
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-200">
              NTN
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-200">
              DONALDSON
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-neutral-200">
              MANN-FILTER
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400"
            >
              เริ่มค้นหาสินค้า
            </Link>

            <Link
              href={`/quote`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              ขอใบเสนอราคา
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center">
          <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
            <Image
              src="/images/hero-products.png"
              alt="Industrial filters and bearings"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}