export function getRfqUiText(locale: string) {
  const isThai = locale === "th";

  return {
    backToHome: isThai ? "กลับหน้าแรก" : "Back to Home",
    backToProducts: isThai ? "กลับไปค้นหาสินค้า" : "Back to Products",
    quoteTitle: isThai ? "ขอใบเสนอราคา" : "Request for Quotation",
    quoteIntro: isThai
      ? "ส่งรายการสินค้าให้ทีม MRT Supplier ตรวจสอบ Part Number, Cross Reference และเสนอราคากลับได้ทันที"
      : "Send your item list to MRT Supplier for part number review, cross-reference support, and fast quotation follow-up.",
    responseTime: isThai ? "เวลาตอบกลับ" : "Response Time",
    responseTimeBody: isThai
      ? "ทีมงานตอบกลับภายใน 24 ชั่วโมง"
      : "Our team responds within 24 hours.",
    crossReference: isThai ? "Cross Reference" : "Cross Reference",
    crossReferenceBody: isThai
      ? "รองรับการช่วยเทียบรหัส OEM และ aftermarket"
      : "We support OEM and aftermarket cross-reference matching.",
    contactMethod: isThai ? "ช่องทางติดต่อ" : "Contact Method",
    contactMethodBody: isThai
      ? "กรอกเบอร์โทร Email หรือ LINE อย่างน้อย 1 ช่องทาง"
      : "Provide phone, email, or LINE for follow-up.",
    quoteItems: isThai ? "รายการสินค้าที่ต้องการ" : "Quote Items",
    itemsInList: (count: number) =>
      isThai ? `${count} รายการใน RFQ` : `${count} items in your RFQ list`,
    clearAll: isThai ? "ล้างทั้งหมด" : "Clear all",
    noItemsTitle: isThai
      ? "ยังไม่มีรายการสินค้าใน RFQ"
      : "No items yet in your RFQ list.",
    noItemsBody: isThai
      ? "เริ่มจากค้นหา Part Number แล้วเพิ่มสินค้าเข้ามาก่อนส่ง RFQ"
      : "Start by searching a part number, then add products before submitting your RFQ.",
    browseProducts: isThai ? "ค้นหาสินค้า" : "Browse Products",
    requestedItem: isThai ? "รายการที่ต้องการ" : "Requested item",
    remove: isThai ? "ลบ" : "Remove",
    quantity: isThai ? "จำนวน" : "Quantity",
    contactDetails: isThai ? "ข้อมูลสำหรับติดต่อกลับ" : "Contact Details",
    contactDetailsBody: isThai
      ? "กรอกข้อมูลให้ครบเท่าที่สะดวก เพื่อให้ทีมงานติดตามกลับได้เร็วขึ้น"
      : "Provide the details you have available so our team can follow up quickly.",
    yourName: isThai ? "ชื่อผู้ติดต่อ" : "Your Name",
    companyOptional: isThai ? "บริษัท (ถ้ามี)" : "Company (optional)",
    phone: isThai ? "เบอร์โทร" : "Phone",
    email: "Email",
    lineId: "LINE ID",
    additionalNote: isThai
      ? "หมายเหตุเพิ่มเติม (ถ้ามี)"
      : "Additional note (optional)",
    followUpRequired: isThai
      ? "สำหรับติดต่อกลับ"
      : "Required for Follow-Up",
    followUpRequiredBody: isThai
      ? "กรอกอย่างน้อย 1 ช่องทาง: เบอร์โทร, Email หรือ LINE"
      : "Provide at least one contact method: phone, email, or LINE.",
    sending: isThai ? "กำลังส่ง..." : "Sending...",
    submitRfq: isThai ? "ส่ง RFQ" : "Submit RFQ",
    addProductsBeforeSubmitting: isThai
      ? "เพิ่มสินค้าก่อนส่ง RFQ"
      : "Add products before submitting",
    emptySubmitHelper: isThai
      ? "เพิ่มสินค้าอย่างน้อย 1 รายการใน RFQ ก่อนส่งคำขอ"
      : "Add at least one product to your RFQ list before submitting.",
    manualRequest: isThai ? "คำขอด้วยตนเอง" : "Manual Request",
    requestedPartNumber: isThai ? "Part Number ที่ต้องการ" : "Requested part number",
    alertAddItem: isThai
      ? "กรุณาเพิ่มอย่างน้อย 1 รายการ"
      : "Please add at least 1 item",
    alertName: isThai
      ? "กรุณากรอกชื่อผู้ติดต่อ"
      : "Please provide your name",
    alertContact: isThai
      ? "กรุณากรอกเบอร์โทร Email หรือ LINE อย่างน้อย 1 ช่องทาง"
      : "Please provide phone, email, or LINE",
    alertSubmitError: isThai
      ? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
      : "Something went wrong",
    requestSubmitted: isThai ? "ส่งคำขอสำเร็จ" : "Request Submitted",
    successTitle: isThai
      ? "เราได้รับคำขอของคุณเรียบร้อยแล้ว"
      : "Your quote request has been received",
    successBody: isThai
      ? "ทีมงานจะตรวจสอบรายการสินค้าและติดต่อกลับโดยเร็ว โดยปกติจะตอบกลับภายใน 24 ชั่วโมงทำการ"
      : "Our team will review your items and respond as soon as possible, typically within 24 business hours.",
    rfqReference: isThai ? "เลขอ้างอิง RFQ" : "RFQ Reference",
    partialFailureTitle: isThai
      ? "ระบบบันทึก RFQ เรียบร้อยแล้ว แต่การแจ้งเตือนบางช่องทางอาจส่งไม่สำเร็จ"
      : "Your RFQ was saved, but one or more notification steps may not have been delivered.",
    partialFailureBody: isThai
      ? "คำขอยังอยู่ในระบบตามเลขอ้างอิงด้านบน แต่แนะนำให้ติดต่อซ้ำทาง LINE หรือ Email หากเป็นงานเร่งด่วน"
      : "Your request is still in the system under the reference above. For urgent requests, please follow up by LINE or email.",
    partialLineNote: isThai
      ? "หมายเหตุ: การแจ้งเตือนทาง LINE ฝั่งแอดมินอาจไม่สำเร็จ"
      : "Note: the admin LINE notification may have failed.",
    sendMoreInfo: isThai
      ? "หากมีรูปสินค้า รายการเพิ่มเติม หรือ Cross Reference สามารถส่งต่อทาง LINE หรือ Email ได้ทันที พร้อมแจ้งเลขอ้างอิงด้านบน"
      : "If you have product photos, additional items, or cross references, send them via LINE or email and include the RFQ reference above.",
    nextSteps: isThai ? "ขั้นตอนถัดไป" : "Next Steps",
    nextStep1Title: isThai ? "1. เก็บเลขอ้างอิงไว้" : "1. Keep Your RFQ Reference",
    nextStep1Body: isThai
      ? "ใช้เลขอ้างอิงนี้เมื่อติดตามกลับทาง LINE หรือ Email เพื่อให้ทีมงานตรวจสอบได้เร็วขึ้น"
      : "Use this reference when following up by LINE or email so our team can review faster.",
    nextStep2Title: isThai ? "2. ส่งข้อมูลเพิ่มเติมได้" : "2. Send More Details",
    nextStep2Body: isThai
      ? "หากมีรูปสินค้า ชื่อเครื่องจักร หรือ Cross Reference เพิ่ม สามารถส่งเพิ่มได้ทันที"
      : "If you have product photos, machine model names, or more cross references, send them anytime.",
    nextStep3Title: isThai ? "3. ค้นหาสินค้าต่อ" : "3. Continue Searching",
    nextStep3Body: isThai
      ? "หากยังมี Part Number อื่นที่ต้องการ สามารถกลับไปค้นหาและส่ง RFQ เพิ่มได้"
      : "If you still have more part numbers to check, go back to products and continue searching.",
    sendDetailsOnLine: isThai
      ? "ส่งรายละเอียดทาง LINE"
      : "Send Details on LINE",
  };
}
