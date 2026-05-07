export function getContactUiText(locale: string) {
  const isThai = locale === "th";

  return {
    contact: isThai ? "ติดต่อ" : "Contact",
    title: isThai ? "ติดต่อ MRT Supplier" : "Contact MRT Supplier",
    intro: isThai
      ? "ส่ง Part Number, cross reference หรือรายการสินค้าที่ต้องการ แล้วทีมงานจะช่วยตรวจสอบและเสนอราคาให้เร็วที่สุด"
      : "Send your part number, cross reference, or product list and our team will review and quote quickly.",
    contactMethods: isThai ? "ช่องทางติดต่อ" : "Contact Methods",
    contactMethodsBody: isThai
      ? "เลือกช่องทางที่สะดวกที่สุด หรือส่ง RFQ ให้ทีมงานติดตามกลับ"
      : "Choose the most convenient channel, or submit an RFQ and our team will follow up.",
    phone: isThai ? "โทร" : "Phone",
    address: isThai ? "ที่อยู่" : "Address",
    addressBody:
      "บริษัท เอ็มอาร์ที ซัพพลายเออร์ จำกัด\n15 ชั้น 2 ซอยบรมราชชนนี 39\nแขวงตลิ่งชัน เขตตลิ่งชัน\nกรุงเทพมหานคร 10170",
    businessHours: isThai ? "เวลาทำการ" : "Business Hours",
    businessHoursBody: isThai
      ? "จันทร์–ศุกร์: 08:30–17:30"
      : "Mon–Fri: 08:30–17:30",
    businessHoursNote: isThai
      ? "ทีมงานตรวจสอบ RFQ และข้อความ LINE ในช่วงเวลาทำการ"
      : "RFQ and LINE inquiries are reviewed during business hours.",
    supportNote: isThai
      ? "ส่งรูปสินค้า รุ่นเครื่องจักร หมายเลข Part Number หรือ cross reference เพิ่มเติมได้ผ่าน RFQ หรือ LINE"
      : "Send product photos, machine model details, part numbers, or cross references through RFQ or LINE.",
    requestQuote: isThai ? "ขอใบเสนอราคา" : "Request Quote",
    addOnLine: isThai ? "เพิ่มเพื่อน LINE" : "Add on LINE",
  };
}
