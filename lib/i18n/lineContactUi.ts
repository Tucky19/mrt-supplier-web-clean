export function getLineContactUiText(locale?: string) {
  const th = locale !== "en";
  return {
    title: th ? "ติดต่อ MRT Supplier ทาง LINE" : "Contact MRT Supplier on LINE",
    close: th ? "ปิด" : "Close",
    qrAlt: th ? "QR สำหรับเปิด LINE OA ของ MRT Supplier" : "QR code for MRT Supplier LINE OA",
    help: th
      ? "สแกน QR ด้วย LINE บนมือถือ หรือค้นหา ID @mrtsupplier ในแอป LINE"
      : "Scan with LINE on your phone, or search for @mrtsupplier in the LINE app.",
    fallback: th
      ? "หาก LINE ไม่เปิด ให้ลองปุ่มด้านล่าง หรือค้นหา ID ในแอป"
      : "If LINE did not open, try the button below or search for the ID in the app.",
    open: th ? "เปิด LINE" : "Open LINE",
    note: th
      ? "พิมพ์หรือวางข้อมูลที่ต้องการสอบถาม ตรวจข้อความก่อนกดส่ง"
      : "Type or paste your enquiry and review it before sending.",
  };
}
