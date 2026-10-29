import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Homepage.module.css";

type CategoryCard = {
  id: string; image: string; href: string;
  title: { th: string; en: string };
  subtitle?: { th: string; en: string };
  description: { th: string; en: string };
};

export default function ProductGrid({ products, locale }: { products: CategoryCard[]; locale: string }) {
  const th = locale === "th";
  return <section id="products" className={styles.categories}>
    <div className={styles.container}>
      <div className={styles.sectionHeading}>
        <h2>{th ? "หมวดหมู่สินค้า" : "Product categories"}</h2>
        <Link href={`/${locale}/products`}>{th ? "ดูสินค้าทั้งหมด" : "View all products"}<ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className={styles.categoryGrid}>
        {products.map(product => <Link key={product.id} href={product.href} className={styles.categoryCard}>
          <div className={styles.categoryImage}><Image src={product.image} alt={th ? product.subtitle?.th || product.title.th : product.title.en} fill sizes="(max-width: 767px) 45vw, 20vw" className="object-contain" /></div>
          <div className={styles.categoryCopy}><h3>{product.title[th ? "th" : "en"]}</h3><p>{th ? product.subtitle?.th : product.description.en}</p><span className={styles.categoryArrow}><ArrowRight size={19} aria-hidden="true" /><span className="sr-only">{th ? "ดูสินค้า" : "View products"}</span></span></div>
        </Link>)}
      </div>
    </div>
  </section>;
}
