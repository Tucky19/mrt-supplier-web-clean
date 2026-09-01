import type { Metadata } from "next";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isThai = locale === "th";

  return {
    title: isThai ? "ส่งรายการขอใบเสนอราคา" : "Submit an RFQ",
    description: isThai
      ? "ส่ง Part Number จำนวน รุ่นเครื่องจักร และข้อมูลติดต่อ เพื่อให้ MRT Supplier ตรวจสอบและเสนอราคา"
      : "Send part numbers, quantities, machine details, and contact information for MRT Supplier to review and quote.",
    alternates: {
      canonical: `/${locale}/quote`,
      languages: {
        th: "/th/quote",
        en: "/en/quote",
        "x-default": "/th/quote",
      },
    },
  };
}

export default function QuoteLayout({ children }: Props) {
  return children;
}
