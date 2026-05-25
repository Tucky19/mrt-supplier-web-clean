export function getMissingProductUiText(locale: string) {
  const isThai = locale === "th";

  return {
    title: isThai
      ? "ไม่มี Part Number ก็ส่งให้เราช่วยหาเทียบได้"
      : "No part number? We can help identify it.",
    description: isThai
      ? "เลือกประเภทกรอง ใส่ขนาดที่วัดได้ หรือแนบรายละเอียดสินค้า ทีม MRT Supplier จะช่วยตรวจสอบสเปคและหาเบอร์เทียบที่เหมาะสมให้"
      : "Send the filter type, measured dimensions, or product details. MRT Supplier will help verify the specification and find a suitable reference or alternative.",
    primaryButton: isThai ? "ส่งข้อมูลให้ทีมช่วยหาเทียบ" : "Send product details",
    secondaryButton: isThai ? "ติดต่อทาง LINE" : "Contact via LINE",
    helper: isThai
      ? "ข้อมูลที่ส่งเข้ามาจะช่วยให้ทีมงานตรวจสอบ จัดหา และเพิ่มสินค้าเข้าระบบได้แม่นยำขึ้น"
      : "Your request helps our team verify, source, and improve our product database.",
    sectionLabel: isThai ? "MISSING PRODUCT REQUEST" : "Missing Product Request",
    noResultsHeading: isThai
      ? "ยังไม่พบสินค้าที่ค้นหา"
      : "We couldn't find that product yet",
    noResultsBody: isThai
      ? "หากยังไม่มีเบอร์หรือยังไม่เจอสินค้าที่ตรง ส่งรายละเอียดให้ทีมช่วยหาเทียบได้ทันที"
      : "If you do not have a part number or the result is still missing, send the details and our team can help identify it.",
    productInfo: isThai ? "ข้อมูลสินค้า" : "Product Information",
    dimensions: isThai ? "ขนาด / สเปกที่วัดได้" : "Measured Dimensions",
    contactInfo: isThai ? "ข้อมูลติดต่อ" : "Contact Information",
    partNo: isThai ? "Part Number (ถ้ามี)" : "Part Number (optional)",
    filterType: isThai ? "ประเภทกรอง" : "Filter Type",
    brand: isThai ? "ยี่ห้อ / แบรนด์" : "Brand",
    qty: isThai ? "จำนวน" : "Quantity",
    machineApplication: isThai ? "เครื่องจักร / การใช้งาน" : "Machine / Application",
    note: isThai ? "รายละเอียดสินค้า" : "Product Details",
    outerDiameter: isThai ? "OD / Outer Diameter" : "OD / Outer Diameter",
    innerDiameter: isThai ? "ID / Inner Diameter" : "ID / Inner Diameter",
    lengthHeight: isThai ? "Length / Height" : "Length / Height",
    threadSize: isThai ? "Thread Size" : "Thread Size",
    gasketOD: isThai ? "Gasket OD" : "Gasket OD",
    gasketID: isThai ? "Gasket ID" : "Gasket ID",
    contactName: isThai ? "ชื่อผู้ติดต่อ" : "Contact Name",
    company: isThai ? "บริษัท" : "Company",
    phone: isThai ? "เบอร์โทร" : "Phone",
    email: "Email",
    lineId: "LINE ID",
    submitLabel: isThai ? "ส่งข้อมูลให้ทีมช่วยหาเทียบ" : "Send product details",
    sending: isThai ? "กำลังส่ง..." : "Sending...",
    successTitle: isThai ? "ส่งข้อมูลเรียบร้อยแล้ว" : "Details sent successfully",
    successBody: isThai
      ? "ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับตามช่องทางที่ให้ไว้"
      : "Our team will review the details and contact you using the information provided.",
    requestReference: isThai ? "เลขอ้างอิง" : "Reference ID",
    validationProduct: isThai
      ? "กรุณากรอกอย่างน้อย 1 รายการ: Part Number, ประเภทกรอง, รายละเอียดสินค้า หรือขนาดที่วัดได้"
      : "Please provide at least one of: part number, filter type, product details, or a measured dimension.",
    validationContact: isThai
      ? "กรุณากรอกช่องทางติดต่ออย่างน้อย 1 ช่องทาง: เบอร์โทร, Email หรือ LINE"
      : "Please provide at least one contact method: phone, email, or LINE.",
    validationQty: isThai
      ? "จำนวนต้องไม่น้อยกว่า 1"
      : "Quantity must be at least 1.",
    submitError: isThai
      ? "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      : "Unable to submit the request. Please try again.",
    backToSearch: isThai ? "กลับไปค้นหาสินค้า" : "Back to product search",
    homepageCtaBody: isThai
      ? "ไม่มีเบอร์ก็ส่งประเภทกรอง ขนาด หรือรายละเอียดสินค้าให้ทีมช่วยหาเทียบได้"
      : "No part number? Send filter type, dimensions, or product details for help identifying it.",
    filterTypeOptions: [
      { value: "", label: isThai ? "เลือกประเภทกรอง" : "Select filter type" },
      { value: "air_filter", label: "Air Filter" },
      { value: "lube_filter", label: "Lube Filter" },
      { value: "fuel_filter", label: "Fuel Filter" },
      { value: "hydraulic_filter", label: "Hydraulic Filter" },
      { value: "fuel_water_separator", label: "Fuel Water Separator" },
      { value: "oil_separator", label: "Oil Separator" },
      { value: "air_oil_separator", label: "Air/Oil Separator" },
      { value: "separator", label: "Separator" },
      { value: "water_filter", label: "Water Filter" },
      { value: "other", label: isThai ? "อื่น ๆ" : "Other" },
      { value: "not_sure", label: isThai ? "ยังไม่แน่ใจ" : "Not sure" },
    ],
  };
}
