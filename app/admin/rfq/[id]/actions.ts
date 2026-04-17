"use server";

import { prisma } from "@/lib/prisma";
import { isRfqStatus } from "@/lib/rfq/types";

export async function updateRfqStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim().toLowerCase();

  if (!id) throw new Error("Missing id");
  if (!isRfqStatus(statusRaw)) throw new Error("Invalid status");

  const existing = await prisma.rfq.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) throw new Error("RFQ not found");
  if (String(existing.status) === statusRaw) return;

  await prisma.rfq.update({
    where: { id },
    data: {
      status: statusRaw,
      events: {
        create: {
          type: "status_changed",
          payload: {
            from: String(existing.status),
            to: statusRaw,
          },
        },
      },
    },
  });
}
