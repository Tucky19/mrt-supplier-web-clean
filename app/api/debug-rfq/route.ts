import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await fetch("http://localhost:3000/api/rfq/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      customer: {
        company: "MRT Supplier Test",
        name: "Tony",
        phone: "0815581323",
        note: "debug test submit",
      },
      items: [
        {
          productId: "donaldson-p554004",
          partNo: "P554004",
          brand: "Donaldson",
          title: "Lube Filter",
          spec: "OD 108mm × L 261mm × 1-1/8-16 UN",
          qty: 2,
        },
      ],
    }),
  });

  const j = await res.json().catch(() => ({}));
  return NextResponse.json({ status: res.status, body: j });
}
