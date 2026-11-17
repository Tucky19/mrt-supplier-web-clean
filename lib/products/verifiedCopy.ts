import type { Product } from "@/types/product";

// Presentation-only copy; never changes catalog specifications or relations.
// P502649: Donaldson SEA Product Bulletin, May 2020 (Coolant Concentrate, OAT 1L).
// P554004: Donaldson New Products, April 2024 (Lube Filter, Spin-on Full Flow).
export function getVerifiedProductCopy(product: Pick<Product, "brand" | "partNo">, locale: string) {
  if (product.brand.trim().toLowerCase() !== "donaldson") return undefined;
  const isThai = locale === "th";
  if (product.partNo === "P502649") {
    return {
      title: isThai ? "น้ำยาหล่อเย็น OAT ชนิดเข้มข้น 1 ลิตร" : "OAT coolant concentrate, 1 litre",
      category: isThai ? "น้ำยาหล่อเย็น" : "Coolant",
      metaTitle: isThai ? "P502649 น้ำยาหล่อเย็น Donaldson OAT 1 ลิตร | MRT Supplier" : "P502649 Donaldson OAT Coolant Concentrate 1 L | MRT Supplier",
      metaDescription: isThai ? "สอบถาม Donaldson P502649 น้ำยาหล่อเย็น OAT ชนิดเข้มข้น ขนาด 1 ลิตร ส่งเบอร์สินค้าและจำนวนเพื่อให้ MRT Supplier ตรวจสอบและเสนอราคา" : "Request a quote for Donaldson P502649 OAT coolant concentrate in a 1-litre container. Send the part number and quantity to MRT Supplier for verification.",
      paragraphs: isThai ? [
        "Donaldson P502649 เป็นน้ำยาหล่อเย็น OAT ชนิดเข้มข้น บรรจุ 1 ลิตร ไม่ใช่ไส้กรองหรือสูตรพร้อมใช้ ก่อนสั่งซื้อควรตรวจสอบข้อกำหนดน้ำยาหล่อเย็นของเครื่องและฉลากผลิตภัณฑ์ที่ใช้อยู่",
        "ระบุ P502649 และจำนวนที่ต้องการในรายการ RFQ หากไม่แน่ใจเรื่องสูตร ส่งรูปฉลากเดิมและรุ่นเครื่องให้ทีม MRT ตรวจสอบก่อนเลือกสินค้า",
      ] : [
        "Donaldson P502649 is OAT coolant concentrate in a 1-litre container, not a filter or ready-to-use premix. Check your equipment's coolant requirements and the label of the product currently in use before ordering.",
        "Add P502649 and the required quantity to your RFQ. If you are unsure about the formulation, send the original label and equipment model to MRT for verification before choosing a product.",
      ],
      verificationNote: isThai ? "หมายเหตุ: กรุณายืนยันสูตรน้ำยาหล่อเย็น ข้อกำหนดของเครื่อง และฉลากผลิตภัณฑ์ก่อนสั่งซื้อ" : "Note: Confirm the coolant formulation, equipment requirements, and product label before ordering.",
    };
  }
  if (product.partNo === "P554004") {
    return {
      title: isThai ? "ไส้กรองน้ำมันเครื่องแบบ Spin-on Full Flow" : "Spin-on full-flow lube filter",
      category: isThai ? "ไส้กรองน้ำมันเครื่อง" : "Lube filter",
      metaTitle: isThai ? "P554004 ไส้กรองน้ำมันเครื่อง Donaldson | MRT Supplier" : "P554004 Donaldson Full-Flow Lube Filter | MRT Supplier",
      metaDescription: isThai ? "Donaldson P554004 ไส้กรองน้ำมันเครื่องแบบ Spin-on Full Flow สอบถามสเปกและขอใบเสนอราคา พร้อมส่งเบอร์เดิมหรือรูปฉลากให้ทีม MRT ตรวจสอบ" : "Donaldson P554004 spin-on full-flow lube filter. View specifications and request a quote. Send the original part number or label to MRT for verification.",
      paragraphs: isThai ? [
        "Donaldson P554004 เป็นไส้กรองน้ำมันหล่อลื่นแบบหมุนเกลียว ชนิด Full Flow สำหรับการเลือกใช้ตามข้อกำหนดของเครื่อง ไม่ควรตัดสินใจใช้ทดแทนจากรูปร่างภายนอกเพียงอย่างเดียว",
        "ส่งรหัส P554004 จำนวนที่ต้องการ และเบอร์ไส้กรองเดิม หากต้องการตรวจรุ่นทดแทน กรุณาแนบรูปฉลากและรุ่นเครื่องด้วย ทีม MRT จะใช้ข้อมูลนี้ประกอบการตรวจสอบและเสนอราคา",
      ] : [
        "Donaldson P554004 is a spin-on full-flow lube filter. Select it according to the equipment requirements rather than assuming compatibility from its external appearance.",
        "Send P554004, the required quantity, and the original filter number. For replacement enquiries, include a label photo and equipment model so MRT can check the request and prepare a quotation.",
      ],
      verificationNote: undefined,
    };
  }
  return undefined;
}
