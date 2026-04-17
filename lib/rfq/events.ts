import { prisma } from "@/lib/prisma";
import type { RfqEventTypeValue } from "@/lib/rfq/types";

export async function logRfqEvent(
  rfqId: string,
  type: RfqEventTypeValue,
  payload?: unknown
) {
  return prisma.rfqEvent.create({
    data: { rfqId, type, payload: payload ?? undefined },
  });
}
