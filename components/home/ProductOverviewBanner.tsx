import Image from "next/image";

export default function ProductOverviewBanner() {
  return (
    <section className="border-t border-slate-200 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-sm">
          <div className="relative h-[300px] w-full md:h-[420px]">
            <Image
              src="/banners/home-industrial-parts-banner.png"
              alt="Industrial filters, bearings, and spare parts supplied by MRT Supplier"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
