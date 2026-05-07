export function getHomeBrandShowcaseText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "INDUSTRIAL BRANDS",
    title: isThai
      ? "แบรนด์อุตสาหกรรมที่รองรับ"
      : "Industrial Brands We Support",
    description: isThai
      ? "คัดเลือกแบรนด์หลักที่ใช้งานจริงในโรงงานและงานซ่อมบำรุง พร้อมรองรับการจัดหาแบรนด์อุตสาหกรรมอื่น ๆ ตาม Part Number และ Cross Reference"
      : "We support trusted core brands and additional industrial brands for maintenance, procurement, and cross-reference sourcing needs.",
    coreHeading: "Core Brands",
    coreHelper: isThai
      ? "แบรนด์หลักที่ใช้งานบ่อยในกลุ่มไส้กรอง แบริ่ง และอะไหล่อุตสาหกรรม"
      : "Frequently requested brands across filtration, bearings, and industrial spare parts.",
    supportingHeading: "Supporting Brands",
    supportingHelper: isThai
      ? "รองรับการตรวจสอบและจัดหาตามเบอร์สินค้า หรือข้อมูล Cross Reference"
      : "Available for part-number checks, sourcing requests, and cross-reference review.",
    items: {
      donaldson: isThai
        ? "โซลูชันงานกรองสำหรับเครื่องยนต์ เครื่องจักรหนัก และระบบอุตสาหกรรม"
        : "Filtration solutions for engines, heavy equipment, and industrial systems.",
      mann: isThai
        ? "ไส้กรองสำหรับงานซ่อมบำรุง โรงงาน และงานจัดหาอะไหล่อุตสาหกรรม"
        : "Filters for maintenance, factory operations, and industrial spare-parts sourcing.",
      ntn: isThai
        ? "แบริ่งและลูกปืนอุตสาหกรรมสำหรับเครื่องจักร ระบบส่งกำลัง และอุปกรณ์หมุน"
        : "Industrial bearings for machinery, power transmission, and rotating equipment.",
    },
  };
}

export function getHomeWhyChooseUsText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "MRT SUPPLIER",
    title: isThai
      ? "ทำไมลูกค้าอุตสาหกรรมเลือก MRT Supplier"
      : "Why Choose MRT Supplier",
    description: isThai
      ? "เราให้ทั้งการสื่อสารที่ชัดเจน ข้อมูลสินค้าที่อ่านง่าย และการตอบกลับ RFQ ที่เหมาะกับงานจัดซื้อและซ่อมบำรุง"
      : "We focus on clear communication, trusted products, and responsive service for industrial customers.",
    items: {
      trusted: {
        title: isThai
          ? "แบรนด์อุตสาหกรรมที่เชื่อถือได้"
          : "Trusted Industrial Brands",
        description: isThai
          ? "คัดเลือกแบรนด์ที่ใช้งานจริงในโรงงานและงานซ่อมบำรุง เพื่อช่วยให้ทีมงานตัดสินใจได้มั่นใจขึ้น"
          : "We prioritize recognized brands that are widely used in industrial environments.",
      },
      response: {
        title: isThai ? "ตอบกลับ RFQ รวดเร็ว" : "Responsive Quotation Support",
        description: isThai
          ? "ช่วยให้ทีมจัดซื้อและทีมซ่อมบำรุงเดินงานต่อได้เร็วขึ้นด้วยการติดตาม RFQ และประสานงานที่ชัดเจน"
          : "We help customers move faster with clear RFQ handling and follow-up.",
      },
      clean: {
        title: isThai ? "ข้อมูลสินค้าอ่านง่าย" : "Clear Product Presentation",
        description: isThai
          ? "จัดวางข้อมูลให้ตรวจสอบแบรนด์ ประเภทสินค้า และสเปกสำคัญได้เร็ว เหมาะกับการค้นหาแบบงานจริง"
          : "Products are presented in a clean format so buyers can scan information quickly.",
      },
      b2b: {
        title: isThai
          ? "รองรับงานจัดซื้อและซ่อมบำรุง"
          : "Built for B2B Workflows",
        description: isThai
          ? "เหมาะสำหรับโรงงาน ฝ่ายจัดซื้อ และทีมซ่อมบำรุงที่ต้องการ workflow ตรงไปตรงมาและติดตามงานได้ง่าย"
          : "Suitable for factory buyers, maintenance teams, and procurement departments.",
      },
    },
  };
}

export function getHomeProductGridText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "PRODUCT CATEGORIES",
    title: isThai ? "กลุ่มสินค้าที่รองรับ" : "Product Categories We Support",
    description: isThai
      ? "ค้นหาหรือส่ง RFQ สำหรับไส้กรอง แบริ่ง และอะไหล่อุตสาหกรรมที่ใช้ในงานซ่อมบำรุงและจัดซื้อ"
      : "Search or request quotations for filtration, bearings, and industrial spare parts used in maintenance and procurement workflows.",
    empty: isThai
      ? "ยังไม่มีกลุ่มสินค้าที่แสดงในขณะนี้"
      : "No product categories available at the moment.",
    viewCategory: isThai ? "ดูสินค้ากลุ่มนี้" : "View category",
  };
}

export function getHomeQuoteCtaText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "MRT SUPPLIER",
    title: isThai
      ? "พร้อมช่วยค้นหาอะไหล่ที่ตรงความต้องการ"
      : "Ready to support your industrial sourcing needs",
    description: isThai
      ? "ส่ง Part Number, รายการอะไหล่ หรือ Cross Reference ให้ทีมงานตรวจสอบ แล้วเราจะช่วยเสนอข้อมูลและราคาที่เหมาะกับงานของคุณ"
      : "Send us your part number, current brand, machine model, or product requirement. Our team will review the details and respond with suitable options.",
    primaryCta: isThai ? "ไปหน้า RFQ" : "Go to Quote Page",
    secondaryCta: isThai ? "ค้นหาสินค้า" : "Contact Our Team",
    lineCta: isThai ? "เพิ่มเพื่อน LINE" : "Add LINE",
  };
}
