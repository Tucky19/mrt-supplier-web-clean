const raw = {
  partNo: "W 940/5",
  category: "oil_filter",
  title: "Oil Filter",
  spec: "OD 93 mm × H 157 mm × Thread 1-12 UNF",
  crossReferences: ["COMPAIR 98262/101", "KOMATSU 600 211 5240"],
};

function slugMannPartNo(partNo: string) {
  return partNo
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\//g, "-");
}

const slug = slugMannPartNo(raw.partNo);

const product = {
  id: `mann-${slug}`,
  partNo: raw.partNo,
  brand: "MANN-FILTER",
  category: raw.category,
  title: raw.title,

  shortDescription: `${raw.partNo} ${raw.title} จาก MANN-FILTER สำหรับงานเครื่องยนต์และเครื่องจักรอุตสาหกรรม`,
  description: `${raw.partNo} เป็นสินค้า MANN-FILTER ใช้สำหรับงานอะไหล่อุตสาหกรรม รองรับการเทียบเบอร์และการจัดหาเพื่อซ่อมบำรุงเครื่องจักร`,

  spec: raw.spec,
  specifications: [],
  applications: [],

  refs: raw.crossReferences,
  crossReferences: raw.crossReferences,

  officialUrl: null,
  officialImageUrl: null,
  imageUrl: `/images/products/mann-filter/${slug}.jpg`,

  stockStatus: "in_stock",
  sourceType: "manual",
  dataQuality: "enriched",
  enrichStatus: "needs_review",
};

console.log(JSON.stringify(product, null, 2));