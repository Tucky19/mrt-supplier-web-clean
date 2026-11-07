import { createMetaHandler } from "@/lib/analytics/meta-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createMetaHandler({ config: () => process.env.VERCEL_ENV === "preview" ? {} : ({
  pixelId: process.env.META_PIXEL_ID,
  token: process.env.META_CONVERSIONS_API_TOKEN,
  testCode: process.env.META_TEST_EVENT_CODE,
}), fetch: (...args) => fetch(...args) });
