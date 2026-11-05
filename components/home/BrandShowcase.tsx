import Image from "next/image";
import Link from "next/link";
import styles from "./Homepage.module.css";
type Brand = { key: string; name: string; logo: string };
export default function BrandShowcase({ brands, locale }: { brands: Brand[]; locale: string }) {
  return <section id="brands" className={styles.brands}>
    <div className={styles.container}>
      <h2>{locale === "th" ? <>แบรนด์สินค้า<br />ที่เราจัดหาให้</> : <>Industrial brands<br />we source</>}</h2>
      <div className={styles.brandLogos}>{brands.map(brand => <Link key={brand.key} href={`/${locale}/products?q=${encodeURIComponent(brand.name)}`} aria-label={brand.name}><Image src={brand.logo} alt={brand.name} width={180} height={60} sizes="(max-width: 767px) 26vw, 180px" /></Link>)}</div>
    </div>
  </section>;
}
