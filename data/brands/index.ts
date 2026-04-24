export type BrandInfo = {
  slug: string;
  name: string;
  description: string;
  ogSubtitle?: string;
  logoUrl?: string;
};

export const brands: BrandInfo[] = [
  {
    slug: "donaldson",
    name: "Donaldson",
    description: "จัดหาสินค้า Donaldson สำหรับงานกรองในภาคอุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า Donaldson พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/donaldson.png",
  },
  {
    slug: "ntn",
    name: "NTN",
    description: "จัดหาสินค้า NTN สำหรับงานตลับลูกปืนและชิ้นส่วนอุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า NTN พร้อมช่วยตรวจสอบรุ่นและความเข้ากันได้ก่อนเสนอราคา",
    logoUrl: "/brands/ntn.png",
  },
  {
    slug: "mann-filter",
    name: "MANN-FILTER",
    description: "จัดหาสินค้า MANN-FILTER สำหรับงานกรองในภาคอุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า MANN-FILTER พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/mann-filter.png",
  },
  {
    slug: "fleetguard",
    name: "Fleetguard",
    description: "จัดหาสินค้า Fleetguard สำหรับงานกรองและอะไหล่อุตสาหกรรม",
    ogSubtitle:
      "จัดหาสินค้า Fleetguard พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา",
    logoUrl: "/brands/fleetguard.png",
  },
];

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}