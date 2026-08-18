export type LocalizedText = {
  th: string;
  en: string;
};

export type LocalizedList = {
  th: string[];
  en: string[];
};

export type BrandSupplyMode = "catalog" | "sourcing";

export type BrandCtaConfig = {
  type: "productsQuery" | "quote";
  label: LocalizedText;
  helper?: LocalizedText;
};

export type BrandFutureDetailFields = {
  overview?: LocalizedText;
  productGroups?: LocalizedList;
  industries?: LocalizedList;
  technicalHighlights?: LocalizedList;
  officialSourceLinks?: Array<{
    label: string;
    url: string;
  }>;
  relationWording?: LocalizedText;
};

export type BrandInfo = {
  slug: string;
  displayName: string;
  name: string;
  logoPath: string;
  searchQuery?: string;
  supplyMode: BrandSupplyMode;
  summary: LocalizedText;
  categories?: LocalizedList;
  applications?: LocalizedList;
  cta: BrandCtaConfig;
  productHref?: string;
  details?: BrandFutureDetailFields;
  officialSourceUrl?: string;
  lastReviewedAt?: string;
  description: string;
  ogSubtitle?: string;
  logoUrl?: string;
};

export const brands: BrandInfo[] = [
  {
    slug: "donaldson",
    displayName: "Donaldson",
    name: "Donaldson",
    logoPath: "/brands/donaldson.png",
    searchQuery: "Donaldson",
    supplyMode: "catalog",
    summary: {
      th: "กลุ่มสินค้าไส้กรองสำหรับงานอุตสาหกรรม เครื่องจักร และงานซ่อมบำรุง",
      en: "Filtration products for industrial equipment, machinery, and maintenance work.",
    },
    cta: {
      type: "productsQuery",
      label: {
        th: "ดูสินค้า",
        en: "View products",
      },
    },
    productHref: "/products?q=Donaldson",
    description:
      "กลุ่มสินค้าไส้กรองสำหรับงานอุตสาหกรรม เครื่องจักร และงานซ่อมบำรุง",
    ogSubtitle:
      "จัดหาสินค้า Donaldson พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/donaldson.png",
  },
  {
    slug: "ntn",
    displayName: "NTN",
    name: "NTN",
    logoPath: "/brands/ntn.png",
    searchQuery: "NTN",
    supplyMode: "sourcing",
    summary: {
      th: "กลุ่มตลับลูกปืนและชิ้นส่วนหมุนสำหรับงานเครื่องจักรอุตสาหกรรม",
      en: "Bearings and rotating components for industrial machinery.",
    },
    cta: {
      type: "quote",
      label: {
        th: "ส่งคำขอสินค้า NTN",
        en: "Request NTN product",
      },
      helper: {
        th: "ส่งเบอร์สินค้า รุ่น หรือรายละเอียดให้ทีมงานตรวจสอบ",
        en: "Send the part number, model, or product details for our team to review.",
      },
    },
    description:
      "กลุ่มตลับลูกปืนและชิ้นส่วนหมุนสำหรับงานเครื่องจักรอุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า NTN พร้อมช่วยตรวจสอบรุ่นและความเข้ากันได้ก่อนเสนอราคา",
    logoUrl: "/brands/ntn.png",
  },
  {
    slug: "mann-filter",
    displayName: "MANN-FILTER",
    name: "MANN-FILTER",
    logoPath: "/brands/mann-filter.png",
    searchQuery: "MANN-FILTER",
    supplyMode: "catalog",
    summary: {
      th: "กลุ่มสินค้าไส้กรองอากาศ น้ำมัน เชื้อเพลิง และงานกรองอุตสาหกรรม",
      en: "Air, oil, fuel, and industrial filtration products.",
    },
    cta: {
      type: "productsQuery",
      label: {
        th: "ดูสินค้า",
        en: "View products",
      },
    },
    productHref: "/products?q=MANN-FILTER",
    description:
      "กลุ่มสินค้าไส้กรองอากาศ น้ำมัน เชื้อเพลิง และงานกรองอุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า MANN-FILTER พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/mann-filter.png",
  },
  {
    slug: "fleetguard",
    displayName: "Fleetguard",
    name: "Fleetguard",
    logoPath: "/brands/fleetguard.png",
    searchQuery: "Fleetguard",
    supplyMode: "sourcing",
    summary: {
      th: "จัดหาสินค้า Fleetguard สำหรับงานกรองและอะไหล่อุตสาหกรรม",
      en: "Fleetguard filtration and industrial spare parts sourcing.",
    },
    cta: {
      type: "quote",
      label: {
        th: "ส่งคำขอสินค้า",
        en: "Request product",
      },
    },
    description: "จัดหาสินค้า Fleetguard สำหรับงานกรองและอะไหล่อุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า Fleetguard พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/fleetguard.png",
  },
];

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

export const brandsIndexSlugs = ["donaldson", "mann-filter", "ntn"] as const;

export const brandsIndexHeroCopy: LocalizedText = {
  th: "จำหน่ายและจัดหาผลิตภัณฑ์อุตสาหกรรมแบรนด์ NTN, Donaldson และ MANN-FILTER",
  en: "We supply and source industrial products from NTN, Donaldson, and MANN-FILTER.",
};

export const brandTrademarkNote: LocalizedText = {
  th: "ชื่อและเครื่องหมายการค้าเป็นทรัพย์สินของเจ้าของแต่ละราย และใช้เพื่อระบุผลิตภัณฑ์ที่เราจำหน่ายและจัดหา",
  en: "Brand names and trademarks belong to their respective owners and are used to identify products that we supply and source.",
};

export function getBrandsIndexItems() {
  return brandsIndexSlugs
    .map((slug) => getBrandBySlug(slug))
    .filter((brand): brand is BrandInfo => Boolean(brand));
}

export function getBrandCtaHref(brand: BrandInfo, locale: string) {
  if (brand.cta.type === "quote") {
    return `/${locale}/quote`;
  }

  const productHref =
    brand.productHref ??
    `/products?q=${encodeURIComponent(brand.searchQuery ?? brand.displayName)}`;

  return `/${locale}${productHref.startsWith("/") ? productHref : `/${productHref}`}`;
}
