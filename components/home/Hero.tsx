import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import SingleSearch from "@/components/search/SingleSearch";
import GlobalSearch from '@/components/search/GlobalSearch';

<GlobalSearch variant="hero" />
export default function Hero() {
  const locale = useLocale();

  return (
    <section className="border-b border-white/10 bg-neutral-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
            Industrial Parts Supplier Platform
          </div>

          <h1 className="text-3xl font-semibold tracking-tight leading-relaxed text-slate-900">
             ค้นหาอะไหล่อุตสาหกรรมได้รวดเร็ว
          </h1>

           <p className="mt-2 text-sm text-slate-600">
             ค้นหาด้วยรหัสสินค้า (Part Number) และส่งคำขอราคาได้ทันที
          <br />
          <span className="text-slate-400">
             Search by part number and request a quotation instantly
          </span>
          </p>
            <p className="mt-2 text-xs text-slate-400">
            ตัวอย่าง: P550084, 6205-2RS, LF17556
          </p>
          <div className="mt-8 w-full max-w-2xl">
            <SingleSearch locale={locale} autoFocus={false} />
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
              href={`/${locale}/products`}
              className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-400"
            >
              เริ่มค้นหาสินค้า
            </Link>

            <Link
              href={`/${locale}/quote`}
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
