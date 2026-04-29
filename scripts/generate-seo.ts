import { products } from "@/data/products/index"
import fs from "fs"

function buildSeo(product: any) {
  const part = product.partNo
  const brand = product.brand

  // 🔥 dynamic keyword
  const keywords = [
    part,
    `${brand} ${part}`,
    `${part} filter`,
    `${part} กรอง`,
    `${brand} filter`,
  ]

  // 🔥 title
  const title = `${brand} ${part} Filter | กรองอุตสาหกรรม คุณภาพสูง`

  // 🔥 description
  const description = `ซื้อ ${brand} ${part} ตัวกรองคุณภาพสูง สำหรับเครื่องจักรอุตสาหกรรม ลดการสึกหรอ เพิ่มประสิทธิภาพ พร้อมบริการ RFQ`

  return {
    title,
    description,
    keywords,
  }
}

function run() {
  const enriched = products.map((p) => ({
    ...p,
    seo: buildSeo(p),
  }))

  fs.writeFileSync(
    "./data/products/products.seo.json",
    JSON.stringify(enriched, null, 2)
  )

  console.log("✅ SEO generated:", enriched.length)
}

run()