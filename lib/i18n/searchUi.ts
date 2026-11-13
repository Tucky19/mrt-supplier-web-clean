export function getSearchUiText(locale: string) {
  const isThai = locale === "th";

  return {
    copySearchText: isThai ? "คัดลอกคำค้น" : "Copy search text",
    copyingSearchText: isThai ? "กำลังคัดลอก…" : "Copying…",
    copySearchHint: isThai
      ? "คัดลอกคำค้น แล้วเปิด LINE เพื่อวางข้อความให้ทีมช่วยตรวจสอบ"
      : "Copy your search, then open LINE and paste it for our team to check.",
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
