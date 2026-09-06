"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Brand = {
  name: string;
  logo?: string;
  imageClassName?: string;
};

type BrandGroup = {
  key: string;
  title: { th: string; en: string };
  description: { th: string; en: string };
  brands: Brand[];
};

const GROUPS: BrandGroup[] = [
  {
    key: "bearings",
    title: { th: "ผู้เชี่ยวชาญด้านลูกปืน", en: "Bearing specialists" },
    description: {
      th: "รับค้นหาและจัดหาลูกปืนจากแบรนด์ที่ทีมงานมีแหล่งจัดหาและประสบการณ์",
      en: "Bearing sourcing support from brands covered by our experienced supply network.",
    },
    brands: [
      { name: "KOYO / JTEKT", logo: "/koyo.svg" },
      { name: "IKO", logo: "/iko.svg" },
      { name: "FAG / Schaeffler" },
    ],
  },
  {
    key: "filters",
    title: { th: "ผู้เชี่ยวชาญด้านไส้กรอง", en: "Filter specialists" },
    description: {
      th: "รับค้นหาไส้กรองจาก Part No. ขนาด และ Specification ก่อนเสนอราคา",
      en: "Filter sourcing by part number, dimensions, and specification before quotation.",
    },
    brands: [
      { name: "SURE FILTER", logo: "/images/brands/secondary/sure-filter.webp" },
      { name: "FULL", logo: "/images/brands/secondary/full-filter.webp" },
      { name: "BACKCUP", logo: "/images/brands/secondary/backcup.webp", imageClassName: "scale-125" },
    ],
  },
  {
    key: "compressors",
    title: { th: "ไส้กรองสำหรับเครื่องอัดอากาศ", en: "Air compressor applications" },
    description: {
      th: "รับค้นหาไส้กรองและ Oil Separator จากรุ่นเครื่องและ Part No.",
      en: "Filter and oil separator sourcing by compressor model and part number.",
    },
    brands: [
      { name: "Atlas Copco", logo: "/images/brands/secondary/atlas-copco.webp" },
      { name: "Hitachi" },
      { name: "Kobelco" },
      { name: "Ingersoll Rand" },
    ],
  },
  {
    key: "generators",
    title: { th: "ไส้กรองสำหรับ Generator และเครื่องยนต์", en: "Generator & engine applications" },
    description: {
      th: "ตรวจสอบจากรุ่น Generator รุ่นเครื่องยนต์ และ Part No. ก่อนเสนอราคา",
      en: "Reviewed by generator model, engine model, and part number before quotation.",
    },
    brands: [
      { name: "MTU", logo: "/images/brands/secondary/mtu.webp" },
      { name: "Cummins" },
      { name: "Perkins" },
      { name: "Mitsubishi" },
      { name: "Denyo" },
    ],
  },
  {
    key: "china-heavy-equipment",
    title: { th: "เครื่องจักรหนักและงานจัดหาไส้กรองจากจีน", en: "Chinese heavy equipment & filter sourcing" },
    description: {
      th: "รับจัดหาเฉพาะไส้กรองและอะไหล่เครื่องจักรหนัก โดยตรวจรุ่นเครื่อง เครื่องยนต์ และ Part No.",
      en: "Sourcing limited to filters and heavy-equipment parts, checked by machine, engine, and part number.",
    },
    brands: [
      { name: "LiuGong", logo: "/images/brands/secondary/liugong.png" },
      { name: "XCMG", logo: "/images/brands/secondary/xcmg.png" },
      { name: "Zoomlion" },
      { name: "SDLG" },
    ],
  },
];

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2";

export default function BrandApplicationCarousel({ locale }: { locale: string }) {
  const isThai = locale === "th";
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeGroup = GROUPS[activeIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % GROUPS.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + GROUPS.length) % GROUPS.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % GROUPS.length);
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
      aria-label={isThai ? "กลุ่มแบรนด์และงานที่ MRT Supplier รองรับ" : "Brand and application groups supported by MRT Supplier"}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {isThai ? activeGroup.title.th : activeGroup.title.en}
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)] sm:text-sm sm:leading-6">
            {isThai ? activeGroup.description.th : activeGroup.description.en}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={showPrevious}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${focusClass}`}
            aria-label={isThai ? "แสดงกลุ่มก่อนหน้า" : "Show previous group"}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] ${focusClass}`}
            aria-label={isThai ? "แสดงกลุ่มถัดไป" : "Show next group"}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        key={activeGroup.key}
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3"
        aria-live="polite"
      >
        {activeGroup.brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/${locale}/products?q=${encodeURIComponent(brand.name.split(" /")[0])}`}
            className={`group flex min-h-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-[var(--mrt-radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-center transition hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-soft)] ${focusClass}`}
          >
            {brand.logo ? (
              <span className="relative block h-10 w-full">
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 45vw, 150px"
                  className={`object-contain ${brand.imageClassName ?? ""}`}
                />
              </span>
            ) : (
              <span className="flex h-10 items-center text-base font-bold tracking-tight text-slate-700">
                {brand.name}
              </span>
            )}
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" aria-label={isThai ? "เลือกกลุ่มแบรนด์" : "Choose brand group"}>
        {GROUPS.map((group, index) => (
          <button
            key={group.key}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-7 bg-[var(--color-primary)]" : "w-2.5 bg-[var(--color-border-strong)] hover:bg-[var(--color-primary)]"
            } ${focusClass}`}
            aria-label={`${isThai ? "แสดง" : "Show"} ${isThai ? group.title.th : group.title.en}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-xs leading-5 text-[var(--color-text-muted)]">
        {isThai
          ? "ชื่อแบรนด์ใช้เพื่อระบุการใช้งานและช่วยค้นหาสินค้า ไม่ได้หมายความว่า MRT Supplier เป็นตัวแทนจำหน่ายทุกแบรนด์"
          : "Brand names identify applications and support product sourcing; they do not imply authorized distributorship."}
      </p>
    </div>
  );
}
