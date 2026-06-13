export function getSearchUiText(locale: string) {
  const isThai = locale === "th";

  return {
    searchPlaceholder: isThai
      ? "ค้นหา Part Number, Cross Reference หรือชื่อสินค้า"
      : "Search part number, cross reference, or description",
    searchButton: isThai ? "ค้นหา" : "Search",
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
    viewAllResults: isThai
      ? "ดูผลลัพธ์ทั้งหมดสำหรับ"
      : "View all results for",
    recentSearches: isThai ? "การค้นหาล่าสุด" : "Recent Searches",
    recent: isThai ? "ล่าสุด" : "Recent",
    bySeparator: isThai ? " โดย " : " by ",
  };
}
