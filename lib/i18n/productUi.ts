export function getProductUiText(locale: string) {
  const isThai = locale === "th";

  return {
    statusAvailable: isThai ? "พร้อมเสนอราคา" : "Available",
    statusRequest: isThai ? "ตรวจสอบสต็อก" : "Check Availability",
    addedToQuote: isThai ? "เพิ่มใน RFQ แล้ว" : "Added to quote",
    viewOfficial: isThai ? "ดูข้อมูลอ้างอิง" : "View Official",
    details: isThai ? "รายละเอียด" : "Details",
    addToQuote: isThai ? "เพิ่มใน RFQ" : "Add to Quote",
    requestQuote: isThai ? "ขอใบเสนอราคา" : "Request Quote",
    industrialGrade: isThai ? "เกรดอุตสาหกรรม" : "Industrial Grade",
    readyToQuote: isThai ? "พร้อมขอราคา" : "Ready to quote",
    readyToQuoteBody: isThai
      ? "เพิ่มสินค้ารายการนี้ใน RFQ หรือขอใบเสนอราคาได้ทันที พร้อมบริการช่วยเทียบรหัส"
      : "Add this part to your RFQ list or request a quote immediately for cross-reference support.",
    rfqSupportNote: isThai
      ? "รองรับการเทียบรหัส OEM และติดตาม RFQ ภายใน 24 ชั่วโมง"
      : "OEM reference support and RFQ follow-up within 24 hours",
    crossReference: isThai ? "Cross Reference" : "Cross Reference",
    applications: isThai ? "การใช้งาน" : "Applications",
    specifications: isThai ? "สเปก" : "Specifications",
    viewOfficialSource: isThai
      ? "ดูข้อมูลอ้างอิงจากแหล่งทางการ"
      : "View Official Source",
  };
}
