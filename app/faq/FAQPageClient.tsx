"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type CategoryKey =
  | "all"
  | "ordering"
  | "shipping"
  | "product"
  | "technical"
  | "payment"
  | "warranty";

type FaqItem = {
  id: string;
  category: Exclude<CategoryKey, "all">;
  q: string;
  a: React.ReactNode;
  keywords?: string[];
};

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function norm(s: any) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[-_/]/g, "")
    .replace(/[()]/g, "");
}

const CATS: Array<{ key: CategoryKey; label: string; hint: string }> = [
  { key: "all", label: "All", hint: "ทั้งหมด" },
  { key: "ordering", label: "RFQ & Ordering", hint: "ขอราคา/สั่งซื้อ" },
  { key: "product", label: "Products", hint: "สินค้า/แบรนด์" },
  { key: "technical", label: "Technical", hint: "สเปค/เทียบเบอร์" },
  { key: "shipping", label: "Shipping", hint: "การจัดส่ง" },
  { key: "payment", label: "Payment & Docs", hint: "ชำระเงิน/เอกสาร" },
  { key: "warranty", label: "Warranty", hint: "รับประกัน/เคลม" },
];

const FAQS: FaqItem[] = [
  {
    id: "rfq-1",
    category: "ordering",
    q: "ขอใบเสนอราคา (RFQ) ต้องทำยังไง?",
    a: (
      <div className="space-y-2">
        <p className="text-white/85">
          ใช้ flow เดียว: <b>Search → Add to Quote → Quote → Submit</b>
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-white/80">
          <li>ค้นหา Part Number (หรือคำสำคัญ) ในหน้า Search</li>
          <li>กด <b>Add to Quote</b> เพื่อรวมรายการ</li>
          <li>ไปหน้า <b>RFQ/Quote</b> ปรับจำนวน + ใส่ข้อมูลติดต่อ</li>
          <li>กด Submit แล้วทีมงานติดต่อกลับพร้อมราคา</li>
        </ol>
      </div>
    ),
    keywords: ["rfq", "quote", "request quote", "ขอราคา", "ใบเสนอราคา"],
  },
  {
    id: "rfq-2",
    category: "ordering",
    q: "กด Add to Quote แล้วทำไมเหมือนไม่มีอะไรเกิดขึ้น?",
    a: (
      <p className="text-white/80">
        รายการจะไปเพิ่มที่หน้า <b>RFQ/Quote</b> ทันที (แนว B2B portal)
        เพื่อให้คุณรวมหลายรายการแล้วค่อย Submit ทีเดียว
      </p>
    ),
    keywords: ["add to quote", "ไม่ขึ้น", "อยู่ไหน", "quote page"],
  },
  {
    id: "product-1",
    category: "product",
    q: "มีสินค้า Donaldson / NTN / MANN หรือไม่?",
    a: (
      <p className="text-white/80">
        รองรับการจัดหา/เสนอราคาสำหรับแบรนด์อุตสาหกรรมหลักตาม Part Number และสเปคที่ลูกค้าต้องการ
      </p>
    ),
    keywords: ["donaldson", "ntn", "mann", "brand"],
  },
  {
    id: "product-2",
    category: "product",
    q: "สินค้าแท้ไหม? มีเอกสารยืนยันได้ไหม?",
    a: (
      <div className="space-y-2">
        <p className="text-white/80">
          สามารถขอรูปสินค้า/ฉลาก/รายละเอียดประกอบจากทีมงานได้ (ขึ้นกับรุ่น)
        </p>
        <p className="text-xs text-white/55">
          * โลโก้แบรนด์เป็นทรัพย์สินของเจ้าของเครื่องหมายการค้า ใช้เพื่ออ้างอิงการจัดหา/รองรับเท่านั้น
        </p>
      </div>
    ),
    keywords: ["แท้", "genuine", "certificate", "เอกสาร"],
  },
  {
    id: "tech-1",
    category: "technical",
    q: "ไม่มี Part Number ตรงรุ่น ช่วยเทียบเบอร์ได้ไหม?",
    a: (
      <p className="text-white/80">
        ได้ ส่งข้อมูลที่มี เช่น เบอร์เดิม, รุ่นเครื่อง, รูปสินค้า, ขนาด (ID/OD/Width/Length) หรือสเปคการกรอง
        ทีมงานช่วยเทียบและแนะนำรุ่นที่เหมาะสมให้
      </p>
    ),
    keywords: ["เทียบเบอร์", "cross reference", "od", "id", "width", "length"],
  },
  {
    id: "tech-2",
    category: "technical",
    q: "ควรส่งข้อมูลอะไรเพื่อให้เสนอราคาได้เร็ว?",
    a: (
      <ul className="list-disc space-y-1 pl-5 text-white/80">
        <li>Part Number / รุ่นเดิม</li>
        <li>แบรนด์ที่ต้องการ (ถ้ามี)</li>
        <li>ขนาดหลัก: ID / OD / Width หรือ Length</li>
        <li>รุ่นเครื่อง/การใช้งาน</li>
        <li>จำนวน + ความเร่งด่วน</li>
      </ul>
    ),
    keywords: ["สเปค", "spec", "ต้องส่งอะไร", "ข้อมูล"],
  },
  {
    id: "ship-1",
    category: "shipping",
    q: "จัดส่งทั่วประเทศไหม? ส่งด่วนได้ไหม?",
    a: (
      <p className="text-white/80">
        จัดส่งได้ทั่วประเทศ (ขึ้นกับพื้นที่/วิธีขนส่ง) หากต้องการด่วนให้ระบุในหมายเหตุหรือแจ้งทีมงานหลังส่ง RFQ
      </p>
    ),
    keywords: ["shipping", "delivery", "ทั่วประเทศ", "ส่งด่วน"],
  },
  {
    id: "pay-1",
    category: "payment",
    q: "ออกใบกำกับภาษี / เอกสารได้ไหม?",
    a: (
      <p className="text-white/80">
        ได้ โปรดกรอกข้อมูลบริษัทและเลขผู้เสียภาษีให้ครบในขั้นตอนขอราคา ทีมงานจะจัดทำเอกสารตามต้องการ
      </p>
    ),
    keywords: ["invoice", "tax", "ใบกำกับ", "เอกสาร"],
  },
  {
    id: "war-1",
    category: "warranty",
    q: "มีการรับประกันหรือเคลมไหม?",
    a: (
      <p className="text-white/80">
        ขึ้นกับประเภทสินค้า/เงื่อนไขผู้ผลิตและการใช้งานจริง หากต้องการเงื่อนไขชัดเจนให้ระบุรุ่นและรูปแบบการใช้งาน
      </p>
    ),
    keywords: ["warranty", "เคลม", "รับประกัน"],
  },
];

function Pill({
  active,
  onClick,
  label,
  hint,
}: {
  active?: boolean;
  onClick?: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
        active
          ? "border-white/25 bg-white/10 text-white"
          : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
      )}
    >
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-white/50">{hint}</span>
    </button>
  );
}

function BrandTrustBar() {
  // ✅ ใส่โลโก้จริงได้ถ้ามีไฟล์ใน public/brands/
  // เช่น /brands/donaldson.png, /brands/ntn.png, /brands/mann.png
  const logos = [
    { name: "Donaldson", src: "/brands/donaldson.png", href: "/products?q=Donaldson" },
    { name: "NTN", src: "/brands/ntn.png", href: "/products?q=NTN" },
    { name: "MANN-FILTER", src: "/brands/mann.png", href: "/products?q=MANN" },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Trusted Industrial Brands</div>
          <div className="text-xs text-white/60">
            แบรนด์ที่จัดหา/รองรับในการเสนอราคา (ขึ้นกับรุ่นและสต็อก)
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {logos.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 hover:bg-white/[0.06]"
              title={b.name}
            >
              {/* ถ้าไม่มีไฟล์โลโก้จริง จะเห็นเป็นกล่อง placeholder */}
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Image
                  src={b.src}
                  alt={`${b.name} logo`}
                  width={80}
                  height={40}
                  className="h-6 w-auto opacity-80 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>
              <div className="text-sm font-semibold text-white">{b.name}</div>
              <div className="text-xs text-white/40 transition group-hover:text-white/70">→</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-3 text-[11px] text-white/45">
        * โลโก้เป็นทรัพย์สินของเจ้าของเครื่องหมายการค้า ใช้เพื่ออ้างอิงการจัดหา/รองรับเท่านั้น
      </div>
    </div>
  );
}

function FaqCard({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{item.q}</div>
          <div className="mt-1 text-xs text-white/50">{item.category.toUpperCase()}</div>
        </div>
        <div
          className={cn(
            "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border text-white/80 transition",
            open ? "border-white/25 bg-white/10" : "border-white/10 bg-black/20"
          )}
          aria-hidden
        >
          {open ? "−" : "+"}
        </div>
      </button>

      {open ? (
        <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm text-white/85">
          {item.a}
        </div>
      ) : null}
    </div>
  );
}

export default function FAQPageClient() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryKey>("all");
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  const results = useMemo(() => {
    const nq = norm(query);
    return FAQS.filter((it) => {
      if (cat !== "all" && it.category !== cat) return false;
      if (!nq) return true;

      const hay = norm(
        it.q +
          " " +
          (it.keywords ?? []).join(" ") +
          " " +
          // safety: a is ReactNode; we only index question+keywords
          ""
      );

      return hay.includes(nq);
    });
  }, [query, cat]);

  const countLabel = useMemo(() => {
    const total = FAQS.length;
    const shown = results.length;
    if (cat === "all" && !query.trim()) return `${total} questions`;
    return `${shown} matched`;
  }, [results.length, cat, query]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/20">
        <div className="absolute inset-0">
          {/* ✅ ใส่ภาพจริงใน public/warehouse.jpg */}
          <Image
            src="/warehouse.jpg"
            alt="MRT Supplier warehouse"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1020]/95 via-[#0b1020]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/85 via-transparent to-transparent" />
        </div>

        <div className="relative p-6 md:p-10">
          <div className="flex flex-col gap-4 md:max-w-2xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
              Enterprise FAQ • Search-first • RFQ-ready
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Frequently Asked Questions
            </h1>

            <p className="text-sm leading-relaxed text-white/80 md:text-base">
              คำถามที่พบบ่อยเกี่ยวกับการค้นหาอะไหล่ การขอราคา (RFQ) การจัดส่ง และสเปคที่ควรส่งเพื่อให้เสนอราคาได้ไวขึ้น
            </p>

            {/* Search + Quick actions */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search FAQ… เช่น "RFQ", "จัดส่ง", "เทียบเบอร์", "ใบกำกับ"'
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/25"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/70">
                  {countLabel}
                </div>
                <Link
                  href={`/quote`}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Open RFQ/Quote
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/[0.1]"
              >
                Search Parts
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.06]"
              >
                Contact
              </Link>
              <Link
                href={`/quote`}
                className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90"
              >
                Request Quote
              </Link>
            </div>

            <BrandTrustBar />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
        {/* SIDEBAR */}
        <aside className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Filter</div>
                <div className="text-xs text-white/60">เลือกหมวดคำถาม</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCat("all");
                  setQuery("");
                  setOpenId(FAQS[0]?.id ?? null);
                }}
                className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/80 hover:bg-white/[0.1]"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {CATS.map((c) => (
                <Pill
                  key={c.key}
                  label={c.label}
                  hint={c.hint}
                  active={cat === c.key}
                  onClick={() => setCat(c.key)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-4">
            <div className="text-sm font-semibold text-white">Fast RFQ tip</div>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              ส่ง Part Number + จำนวน + รูปสินค้า/สเปคหลัก (ID/OD/Width/Length) จะได้ราคาไวขึ้นมาก
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/quote`}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Request Quote
              </Link>
              <Link
                href="/products"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/[0.1]"
              >
                Search
              </Link>
            </div>
          </div>
        </aside>

        {/* FAQ LIST */}
        <div className="space-y-3">
          {results.length ? (
            results.map((it) => (
              <FaqCard
                key={it.id}
                item={it}
                open={openId === it.id}
                onToggle={() => setOpenId((cur) => (cur === it.id ? null : it.id))}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-sm font-semibold text-white">No results</div>
              <div className="mt-1 text-sm text-white/70">
                ลองเปลี่ยนคำค้น หรือกด Reset เพื่อดูทั้งหมด
              </div>
            </div>
          )}

          {/* CTA (bottom) */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <div className="relative">
              <div className="absolute inset-0">
                <Image
                  src="/hero-products.png"
                  alt="Industrial parts"
                  fill
                  className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1020]/95 via-[#0b1020]/70 to-transparent" />
              </div>

              <div className="relative p-6 md:p-8">
                <div className="max-w-2xl">
                  <div className="text-sm font-semibold text-white">
                    Still have questions?
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    ส่ง RFQ มาได้เลย ทีมงานช่วยตรวจสอบสเปค/เทียบเบอร์ และติดต่อกลับเร็วที่สุด
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/quote`}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Request Quote (RFQ)
                    </Link>
                    <Link
                      href="/products"
                      className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.1]"
                    >
                      Search More Parts
                    </Link>
                    <Link
                      href="/contact"
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.06]"
                    >
                      Contact
                    </Link>
                  </div>

                  <div className="mt-3 text-xs text-white/50">
                    Tip: ใส่ Part Number + จำนวน + ความเร่งด่วน → response ไวขึ้นแบบเห็นผล
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} MRT Supplier • FAQ
          </div>
        </div>
      </section>
    </main>
  );
}
