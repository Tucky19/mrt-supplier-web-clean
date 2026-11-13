export function getSearchUiText(locale: string) {
  const isThai = locale === "th";

  return {
    contactLine: isThai ? "ติดต่อทีมทาง LINE" : "Contact our team on LINE",
    lineHelpLink: isThai ? "เปิด LINE ไม่ได้? ดูวิธีติดต่อ" : "Can't open LINE? View contact options",
    lineQrAlt: isThai ? "QR สำหรับเปิด LINE OA ของ MRT Supplier" : "QR code for MRT Supplier LINE OA",
    lineDesktopHelp: isThai
      ? "ใช้ LINE บนมือถือสแกน QR นี้ หรือเปิดแอป LINE แล้วค้นหา ID ด้านล่าง"
      : "Scan this QR code with LINE on your phone, or open the LINE app and search for the ID below.",
    linePasteHelp: isThai
      ? "เมื่อเข้าบัญชี MRT Supplier แล้ว ให้วางหรือพิมพ์คำค้นในแชต ตรวจข้อความก่อนกดส่ง"
      : "Once in MRT Supplier's chat, paste or type your search text. Review it before sending.",
    copySearchText: isThai ? "คัดลอกคำค้น" : "Copy search text",
    copyingSearchText: isThai ? "กำลังคัดลอก…" : "Copying…",
    copySearchHint: isThai
      ? "คัดลอกคำค้น แล้วติดต่อทีมทาง LINE เพื่อให้ช่วยตรวจสอบ"
      : "Copy your search, then contact our team on LINE for help.",
    searchTextCopied: isThai
      ? "คัดลอกแล้ว เปิด LINE แล้ววางข้อความได้เลย"
      : "Copied. Open LINE and paste your search text.",
    searchTextCopyFailed: isThai
      ? "คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกข้อความด้านล่างแล้วคัดลอกด้วยตนเอง"
      : "Could not copy automatically. Select the text below and copy it manually.",
    searchTextToCopy: isThai ? "คำค้นสำหรับคัดลอก" : "Search text to copy",
    searchPlaceholder: isThai
      ? "Part No. / Cross Ref."
      : "Part No. / Cross Ref.",
    searchButton: isThai ? "ค้นหา" : "Search",
    searching: isThai ? "ค้นหา..." : "Searching...",
    searchInputLabel: isThai ? "ค้นหาสินค้า" : "Search products",
    tryLabel: isThai ? "ตัวอย่าง:" : "Try:",
    partNumber: isThai ? "Part Number" : "Part Number",
    crossRef: isThai ? "Cross Reference" : "Cross Ref",
    sameBrandRef: isThai ? "Same-brand Reference" : "Same-brand Ref",
    usedTogether: isThai ? "Used together / Kit" : "Used together / Kit",
    match: isThai ? "ผลลัพธ์" : "Match",
    partNumberMatches: isThai
      ? "ผลลัพธ์ Part Number ที่ตรงกัน"
      : "Part Number Matches",
    crossReferences: isThai ? "Cross Reference" : "Cross References",
    sameBrandReferences: isThai ? "Same-brand Reference" : "Same-brand References",
    usedTogetherMatches: isThai ? "Used together / Kit components" : "Used together / Kit components",
    relatedMatches: isThai ? "ผลลัพธ์ที่เกี่ยวข้อง" : "Related Matches",
    exactMatch: isThai ? "ตรงกับ Part Number" : "Exact part match",
    partNumberMatch: isThai ? "ตรงกับ Part No." : "Part number match",
    crossReferenceMatch: isThai ? "ตรงกับ Cross Reference" : "Cross-reference match",
    sameBrandReferenceMatch: isThai
      ? "Same-brand Reference"
      : "Same-brand reference",
    usedTogetherMatch: isThai ? "สินค้าที่ใช้ร่วมกัน" : "Used-together part",
    relatedMatch: isThai ? "ผลลัพธ์ที่เกี่ยวข้อง" : "Related match",
    dimensionMatch: isThai
      ? "ตรงตามเงื่อนไขขนาด"
      : "Matches dimension criteria",
    viewAllResults: isThai
      ? "ดูผลลัพธ์ทั้งหมดสำหรับ"
      : "View all results for",
    recentSearches: isThai ? "การค้นหาล่าสุด" : "Recent Searches",
    recent: isThai ? "ล่าสุด" : "Recent",
    bySeparator: isThai ? " โดย " : " by ",
  };
}
