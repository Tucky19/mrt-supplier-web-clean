export function getHomeBrandShowcaseText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "INDUSTRIAL BRANDS",
    title: isThai
      ? "แบรนด์อุตสาหกรรมที่รองรับ"
      : "Industrial Brands We Support",
    description: isThai
      ? "รองรับการค้นหาและจัดหาตาม Part Number, Cross Reference และข้อมูลการใช้งาน สำหรับโรงงาน ช่างซ่อมบำรุง และร้านค้า"
      : "Support for sourcing by Part Number, Cross Reference, and application details for factories, maintenance teams, and resellers.",
    coreHeading: "Core Brands",
    coreHelper: isThai
      ? "แบรนด์หลักที่ใช้งานบ่อยในกลุ่มไส้กรอง ตลับลูกปืน และอะไหล่อุตสาหกรรม"
      : "Frequently requested brands across filtration, bearings, and industrial spare parts.",
    supportingHeading: "Supporting Brands",
    supportingHelper: isThai
      ? "มีเบอร์สินค้าเดิมหรือแบรนด์อื่น สามารถส่งให้ทีมช่วยตรวจสอบรายการที่เกี่ยวข้อง"
      : "Send an existing part number or another brand for related-reference review.",
    items: {
      donaldson: isThai
        ? "โซลูชันงานกรองสำหรับเครื่องยนต์ เครื่องจักรหนัก และระบบอุตสาหกรรม"
        : "Filtration solutions for engines, heavy equipment, and industrial systems.",
      mann: isThai
        ? "ไส้กรองสำหรับงานซ่อมบำรุง โรงงาน และงานจัดหาอะไหล่อุตสาหกรรม"
        : "Filters for maintenance, factory operations, and industrial spare-parts sourcing.",
      ntn: isThai
        ? "ตลับลูกปืนอุตสาหกรรมสำหรับเครื่องจักร ระบบส่งกำลัง และอุปกรณ์หมุน"
        : "Industrial bearings for machinery, power transmission, and rotating equipment.",
    },
  };
}

export function getHomeWhyChooseUsText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "MRT SUPPLIER",
    title: isThai
      ? "ทำไม MRT Supplier เหมาะกับงานจัดหาอะไหล่"
      : "Why MRT Supplier fits industrial sourcing work",
    description: isThai
      ? "โฟกัสที่การค้นหาให้ตรง การสื่อสารให้ชัด และการส่งต่อ RFQ ให้ทีมงานติดตามได้ง่าย ไม่ว่าคุณจะเป็นโรงงาน ช่าง หรือร้านค้า"
      : "Focused on accurate searching, clear communication, and an RFQ flow that works for factories, technicians, and resellers.",
    items: {
      trusted: {
        title: isThai
          ? "แบรนด์อุตสาหกรรมที่ใช้งานจริง"
          : "Industrial brands used in real applications",
        description: isThai
          ? "รองรับแบรนด์ที่พบได้บ่อยในงานโรงงาน เครื่องจักร และงานซ่อมบำรุง พร้อมตรวจสอบตามข้อมูลที่ลูกค้าส่งมา"
          : "Support for brands commonly found in factories, machinery, and maintenance work, reviewed against customer-supplied details.",
      },
      response: {
        title: isThai ? "RFQ ที่ติดตามงานต่อได้" : "RFQs built for follow-up",
        description: isThai
          ? "รวมหลายรายการไว้ในคำขอเดียว เพื่อให้ทีมจัดซื้อ ช่าง และร้านค้าส่งข้อมูลและติดตามต่อได้ง่าย"
          : "Collect multiple items in one request so purchasing teams, technicians, and resellers can follow up efficiently.",
      },
      clean: {
        title: isThai ? "ข้อมูลสินค้าอ่านง่าย" : "Clear product presentation",
        description: isThai
          ? "จัดวางข้อมูลให้ตรวจสอบแบรนด์ ประเภทสินค้า Part No. และสเปกสำคัญได้เร็ว"
          : "Product information is structured for quick checks of brand, category, Part No., and key specifications.",
      },
      b2b: {
        title: isThai
          ? "รองรับทั้ง End User ช่าง และร้านค้า"
          : "Built for end users, technicians, and resellers",
        description: isThai
          ? "เริ่มได้ทั้งจากการค้นหา Part No., ส่งรูป/Nameplate หรือส่งรายการหลายเบอร์เพื่อขอ RFQ"
          : "Start from a Part No. search, a photo/nameplate, or a multi-item RFQ list.",
      },
    },
  };
}

export function getHomeProductGridText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "PRODUCT CATEGORIES",
    title: isThai ? "เริ่มค้นหาจากกลุ่มสินค้า" : "Start with a product category",
    description: isThai
      ? "เลือกกลุ่มสินค้าเพื่อค้นหา Part No. หรือใช้เป็นจุดเริ่มต้นก่อนส่งรายละเอียดให้ทีมช่วยตรวจสอบ"
      : "Choose a category to search by Part No. or use it as a starting point before sending details for review.",
    empty: isThai
      ? "ยังไม่มีกลุ่มสินค้าที่แสดงในขณะนี้"
      : "No product categories available at the moment.",
    viewCategory: isThai ? "ดูสินค้ากลุ่มนี้" : "View category",
  };
}

export function getHomeQuoteCtaText(locale: string) {
  const isThai = locale === "th";

  return {
    eyebrow: "READY TO START",
    title: isThai
      ? "มี Part No., รูปสินค้า หรือรายการ PM? ส่งมาให้ทีมตรวจสอบได้เลย"
      : "Have a Part No., product photo, or PM list? Send it for review.",
    description: isThai
      ? "เริ่ม RFQ ได้จากข้อมูลที่คุณมี ไม่ว่าจะเป็นเบอร์เดิม รุ่นเครื่อง Nameplate หรือหลายรายการในครั้งเดียว"
      : "Start an RFQ with the information you have: an existing part number, machine model, nameplate, or a multi-item list.",
    primaryCta: isThai ? "ส่ง RFQ" : "Send RFQ",
    secondaryCta: isThai ? "ค้นหาสินค้า" : "Search Products",
    lineCta: isThai ? "ส่งข้อมูลทาง LINE" : "Send via LINE",
  };
}
