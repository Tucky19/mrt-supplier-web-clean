import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEnvSummary } from "@/lib/env.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const env = getEnvSummary();

    const dbCheck = await prisma.$queryRawUnsafe("SELECT 1 as ok");

    return NextResponse.json({
      ok: true,
      service: "mrt-supplier-web-clean",
      timestamp: new Date().toISOString(),
      env,
      db: {
        ok: true,
        result: dbCheck,
      },
    });
  } catch (error) {
    console.error("[HEALTH_ROUTE_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        service: "mrt-supplier-web-clean",
        timestamp: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : "Health check failed.",
      },
      { status: 500 }
    );
  }
}