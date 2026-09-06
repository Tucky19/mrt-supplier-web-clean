"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type SecondaryBrand = {
  name: string;
  logo?: string;
  width?: number;
  height?: number;
  slotClassName?: string;
  query?: string;
};

const BRAND_SETS: SecondaryBrand[][] = [
  [
    { name: "Fleetguard", logo: "/images/brands/secondary/fleetguard.png", width: 225, height: 225, slotClassName: "h-10 sm:h-11" },
    { name: "Baldwin Filters", logo: "/images/brands/secondary/baldwin-filters.png", width: 600, height: 600, slotClassName: "h-10 sm:h-11" },
    { name: "WIX Filters", logo: "/images/brands/secondary/wix-filters.png", width: 2000, height: 1862, slotClassName: "h-10 sm:h-11" },
    { name: "Parker", logo: "/images/brands/secondary/parker.png", width: 518, height: 518, slotClassName: "h-9 sm:h-10" },
    { name: "K-FLO", logo: "/images/brands/secondary/k-flo.png", width: 210, height: 90, slotClassName: "h-8 sm:h-9" },
    { name: "Atlas Copco", logo: "/images/brands/secondary/atlas-copco.webp", width: 330, height: 159, slotClassName: "h-8 sm:h-9" },
    { name: "XCMG", logo: "/images/brands/secondary/xcmg.png", width: 1020, height: 680, slotClassName: "h-8 sm:h-9" },
    { name: "LiuGong", logo: "/images/brands/secondary/liugong.png", width: 2000, height: 707, slotClassName: "h-7 sm:h-8" },
  ],
  [
    { name: "KOYO / JTEKT", logo: "/koyo.svg", width: 320, height: 120, slotClassName: "h-9 sm:h-10", query: "KOYO" },
    { name: "IKO", logo: "/iko.svg", width: 320, height: 120, slotClassName: "h-9 sm:h-10" },
    { name: "FAG / Schaeffler", query: "FAG" },
    { name: "SURE FILTER", logo: "/images/brands/secondary/sure-filter.webp", width: 500, height: 300, slotClassName: "h-10 sm:h-11" },
    { name: "FULL", logo: "/images/brands/secondary/full-filter.webp", width: 500, height: 300, slotClassName: "h-10 sm:h-11" },
    { name: "BACKCUP", logo: "/images/brands/secondary/backcup.webp", width: 900, height: 400, slotClassName: "h-10 scale-125 sm:h-11" },
    { name: "Hitachi" },
    { name: "Kobelco" },
  ],
  [
    { name: "Ingersoll Rand" },
    { name: "MTU", logo: "/images/brands/secondary/mtu.webp", width: 800, height: 450, slotClassName: "h-10 sm:h-11" },
    { name: "Cummins" },
    { name: "Perkins" },
    { name: "Mitsubishi" },
    { name: "Denyo" },
    { name: "Zoomlion" },
    { name: "SDLG" },
  ],
];

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2";

export default function BrandApplicationCarousel({ locale }: { locale: string }) {
  const isThai = locale === "th";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % BRAND_SETS.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + BRAND_SETS.length) % BRAND_SETS.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % BRAND_SETS.length);
  };

  return (
    <div
      className="min-w-0 rounded-[var(--mrt-radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label={isThai ? "แบรนด์รองที่รองรับการค้นหาและจัดหา" : "Secondary brands supported for search and sourcing"}
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold text-[var(--color-text)]">
          {isThai ? "รับค้นหาและเทียบเบอร์จากหลายแบรนด์" : "Cross-reference support for multiple brands"}
        </p>
        <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)] sm:text-sm sm:leading-6">
          {isThai
            ? "ค้นหาแบรนด์ที่คุณใช้อยู่ หรือส่ง Part No. ให้ทีมงานช่วยตรวจสอบ"
            : "Find a brand you use, or send its part number for our team to review."}
        </p>
      </div>

      <div className="relative mt-4 px-7 sm:px-8">
        <button
          type="button"
          onClick={showPrevious}
          className={`absolute left-0 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${focusClass}`}
          aria-label={isThai ? "แสดงแบรนด์ชุดก่อนหน้า" : "Show previous brand set"}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        <ul
          key={activeIndex}
          aria-live="polite"
          className="brand-set-enter grid grid-cols-3 gap-2 sm:flex sm:min-h-[136px] sm:flex-wrap sm:content-center sm:justify-center"
        >
          {BRAND_SETS[activeIndex].map((brand) => (
            <li key={brand.name} className="sm:basis-[calc(20%-0.5rem)]">
              <Link
                href={`/${locale}/products?q=${encodeURIComponent(brand.query ?? brand.name)}`}
                className={`group flex min-h-16 items-center justify-center overflow-hidden rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] sm:min-h-14 ${focusClass}`}
                aria-label={`${isThai ? "ค้นหาแบรนด์" : "Search brand"} ${brand.name}`}
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={brand.width ?? 320}
                    height={brand.height ?? 120}
                    className={`w-full object-contain ${brand.slotClassName ?? "h-8 sm:h-9"}`}
                    sizes="(max-width: 640px) 25vw, 105px"
                  />
                ) : (
                  <span className="text-center text-xs font-bold leading-4 text-slate-600 group-hover:text-[var(--color-primary)] sm:text-sm">
                    {brand.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={showNext}
          className={`absolute right-0 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] shadow-sm transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${focusClass}`}
          aria-label={isThai ? "แสดงแบรนด์ชุดถัดไป" : "Show next brand set"}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2" aria-label={isThai ? "เลือกชุดแบรนด์" : "Choose brand set"}>
        {BRAND_SETS.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-[var(--color-primary)]" : "w-2 bg-[var(--color-border-strong)] hover:bg-[var(--color-primary)]"
            } ${focusClass}`}
            aria-label={`${isThai ? "แสดงแบรนด์ชุดที่" : "Show brand set"} ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-[var(--color-text-muted)]">
        {isThai
          ? "ชื่อแบรนด์ใช้เพื่อช่วยระบุสินค้าและการใช้งาน ไม่ได้หมายความว่า MRT Supplier เป็นตัวแทนจำหน่ายทุกแบรนด์"
          : "Brand names support product and application identification; they do not imply authorized distributorship."}
      </p>
    </div>
  );
}
