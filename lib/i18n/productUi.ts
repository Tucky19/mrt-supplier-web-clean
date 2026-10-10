export function getProductUiText(locale: string) {
  const isThai = locale === "th";

  return {
    catalogApplications: isThai ? "รุ่นเครื่องและ OEM ตามแค็ตตาล็อก" : "Equipment and OEM catalogue references",
    catalogCaution: isThai
      ? "รุ่นเครื่องเดียวกันอาจใช้เครื่องยนต์หรือกรองต่างกัน กรุณาเทียบเบอร์บนชิ้นงานเดิม รายการนี้ไม่ได้หมายถึงกรองทั้งชุด"
      : "The same model may use different engines or filters. Check the number on the fitted part. These entries do not define a complete filter kit.",
    applicationReferenceLabel: isThai ? "ข้อมูลอ้างอิงการใช้งาน — ต้องตรวจสอบก่อนสั่ง" : "Application Reference — Verification Required",
    customerReferenceLabel: isThai ? "ข้อมูลอ้างอิงลูกค้า — รอตรวจสอบการใช้งาน" : "Customer Reference — Application Review Required",
    applicationCaution: isThai
      ? "กรุณายืนยันรุ่นเครื่องยนต์ Serial และ Part No. เดิมก่อนสั่งซื้อ"
      : "Confirm engine, serial number, and original part number before ordering.",
    partReference: isThai ? "Part No. อ้างอิง" : "Part reference",
    applicationOemReference: isThai ? "OEM/Application Ref" : "OEM/Application reference",
    referenceNumbersForReview: isThai ? "เบอร์อ้างอิง / Cross Reference สำหรับตรวจสอบ" : "Reference Part Numbers — Verification Required",
    referenceCaution: isThai
      ? "กรุณาตรวจสอบสเปกและการใช้งานกับทีมก่อนสั่งซื้อ"
      : "Verify specifications and application with our team before ordering.",
    applicationRequestPrompt: isThai
      ? "หากขอเทียบตามรุ่นเครื่อง กรุณาระบุ Engine / Serial / Part No. เดิม"
      : "For application-based requests, include engine, serial number, and original part number.",
    catalogOem: isThai ? "OEM ตามเอกสาร" : "OEM as listed",
    catalogReview: isThai ? "ข้อมูลเบอร์เทียบรอตรวจสอบ" : "Reference pending review",
    catalogPage: isThai ? "หน้า" : "Page",
    catalogMissing: isThai ? "ไม่ระบุ" : "Not specified",
    statusCheck: isThai ? "ตรวจสอบสินค้า" : "Check availability",
    statusAvailable: isThai ? "มีสินค้า" : "In stock",
    statusRequest: isThai ? "มีสินค้า" : "In stock",
    addedToQuote: isThai ? "เพิ่มใน RFQ แล้ว" : "Added to quote",
    viewOfficial: isThai ? "ดูข้อมูลทางการ" : "View Official",
    details: isThai ? "รายละเอียด" : "Details",
    addToQuote: isThai ? "เพิ่มใน RFQ" : "Add to Quote",
    requestQuote: isThai ? "ขอใบเสนอราคา" : "Request Quote",
    industrialGrade: isThai ? "เกรดอุตสาหกรรม" : "Industrial Grade",
    readyToQuote: isThai ? "พร้อมขอราคา" : "Ready to quote",
    readyToQuoteBody: isThai
      ? "เพิ่มสินค้ารายการนี้ใน RFQ หรือขอใบเสนอราคาได้ทันที พร้อมบริการช่วยเทียบรหัส"
      : "Add this part to your RFQ list or request a quote immediately for cross-reference support.",
    rfqSupportNote: isThai
      ? "รองรับการตรวจสอบ OEM Part No. และติดตาม RFQ ภายใน 24 ชั่วโมง"
      : "OEM reference support and RFQ follow-up within 24 hours",
    crossReference: isThai ? "Cross Reference" : "Cross Reference",
    references: isThai ? "Cross Reference" : "References",
    applications: isThai ? "การใช้งาน" : "Applications",
    specifications: isThai ? "สเปก" : "Specifications",
    viewOfficialSource: isThai
      ? "ดูข้อมูลจาก Official Source"
      : "View Official Source",
  };
}
