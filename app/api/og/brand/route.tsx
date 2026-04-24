import { ImageResponse } from "next/og";
import { OgBrand } from "@/lib/og/buildOgBrand";
import { truncate } from "@/lib/og/shared";
import type { ReactNode } from "react";
export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const locale = searchParams.get("locale") ?? "th";
  const requestedName = searchParams.get("name") ?? "MRT Supplier";
  const requestedSubtitle = searchParams.get("subtitle") ?? "";

  const name = truncate(requestedName, 42);

  const subtitle = truncate(
    requestedSubtitle ||
      (locale === "th"
        ? "จัดหาสินค้าอุตสาหกรรม พร้อมช่วยตรวจสอบและเทียบเบอร์ก่อนเสนอราคา"
        : "Industrial parts sourcing with verification and cross-reference support before quotation."),
    110
  );

  return new ImageResponse(
    <OgBrand name={name} subtitle={subtitle} locale={locale} />,
    size
  );
}