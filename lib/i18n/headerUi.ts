export function getHeaderUiText(locale: string) {
  const isThai = locale === "th";

  return {
    tagline: isThai
      ? "อะไหล่อุตสาหกรรมและบริการ RFQ"
      : "Industrial Parts & RFQ Service",
    home: isThai ? "หน้าแรก" : "Home",
    products: isThai ? "สินค้า" : "Products",
    contact: isThai ? "ติดต่อเรา" : "Contact",
    requestQuote: isThai ? "ขอใบเสนอราคา" : "Request Quote",
  };
}
