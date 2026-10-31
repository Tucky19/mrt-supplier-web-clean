import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, Cog, Headset, MessageCircle } from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import SearchBar from "@/components/search/SearchBar";
import styles from "./Homepage.module.css";

export default function SearchFirstHero({ locale, children }: { locale: string; children?: ReactNode }) {
  const th = locale === "th";
  const benefits = [
    { icon: Cog, text: th ? "อะไหล่หลากหลายแบรนด์\nสำหรับงานอุตสาหกรรม" : "Multi-brand parts\nfor industrial applications" },
    { icon: Headset, text: th ? "ส่งรูปหรือ Nameplate\nให้ทีมช่วยตรวจสอบ" : "Send photos or nameplates\nfor product review" },
    { icon: ClipboardList, text: th ? "รวบรวมหลายรายการ\nส่งคำขอใบเสนอราคา" : "Collect multiple items\nin one RFQ" },
  ];
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImage} aria-hidden="true">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero/mrt-industrial-desktop.webp" />
            <img src="/images/hero/mrt-industrial-mobile.webp" alt="" width={1122} height={1402} fetchPriority="high" />
          </picture>
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>Industrial Parts Supplier</p>
            <h1>{th ? <>ค้นหาอะไหล่<span>อุตสาหกรรม</span></> : <>Find your <span>industrial parts</span></>}</h1>
            <p className={styles.heroDescription}>{th ? "ค้นหาด้วย Part Number หรือส่งรายการให้เราช่วยจัดหา" : "Search by part number, or send your list for sourcing support."}</p>
            <div className={styles.heroSearch}>
              <SearchBar locale={locale} autoFocus={false} exampleQueries={["P181080", "P551864", "FS1242"]} compactMobileExamples className={styles.search} />
            </div>
            <div className={styles.heroActions}>
              <Link href={`/${locale}/quote`} className={styles.rfqButton}><ClipboardList size={19} aria-hidden="true" />{th ? "ขอใบเสนอราคา" : "Request a quote"}<ArrowRight size={16} aria-hidden="true" /></Link>
              <TrackedLineLink href="https://lin.ee/PsQGAuu" source="hero_search" locale={locale} className={styles.lineButton}><MessageCircle size={20} aria-hidden="true" />LINE OA<ArrowRight size={16} aria-hidden="true" /></TrackedLineLink>
            </div>
          </div>
          <div className={styles.heroBenefits}>
            {benefits.map(({ icon: Icon, text }) => <div key={text}><Icon aria-hidden="true" /><p>{text}</p></div>)}
          </div>
        </div>
      </section>
      {children}
    </>
  );
}
