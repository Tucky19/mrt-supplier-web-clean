import Link from "next/link";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import TrackedLineLink from "@/components/analytics/TrackedLineLink";
import styles from "./Homepage.module.css";
export default function QuoteCTASection({ locale }: { locale: string }) {
  const th = locale === "th";
  return <section id="contact" className={styles.contact}>
    <div className={styles.container}>
      <div><h2>{th ? "ติดต่อเรา" : "Talk to our team"}</h2><p>{th ? "ให้เราช่วยจัดหาอะไหล่อุตสาหกรรม\nสำหรับงานของคุณ" : "Industrial parts sourcing\nfor your requirements."}</p></div>
      <a href="tel:0970122111"><Phone aria-hidden="true" /><span>{th ? "โทรสอบถาม" : "Call our team"}<small>097 012 2111</small></span></a>
      <a href="mailto:sales@mrtsupplier.com"><Mail aria-hidden="true" /><span>{th ? "ส่งรายการสินค้า" : "Send your parts list"}<small>sales@mrtsupplier.com</small></span></a>
      <TrackedLineLink href="https://lin.ee/PsQGAuu" source="home_final_cta" locale={locale}><MessageCircle aria-hidden="true" /><span>{th ? "พูดคุยผ่าน" : "Contact via"}<small>LINE OA</small></span></TrackedLineLink>
      <Link href={`/${locale}/quote`} className={styles.contactRfq}>{th ? "ส่งคำขอ RFQ" : "Request a quote"}<ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
  </section>;
}
