export async function sendRfqLineNotification(payload: {
  requestId: string;
  company?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  lineId?: string | null;
  itemCount: number;
  requestTypeLabel?: string | null;
  includeContactDetails?: boolean;
  extraLines?: Array<string | null | undefined>;
}) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_TARGET_USER_ID;

  if (!token || !to) {
    throw new Error("LINE Messaging API config missing");
  }

  const text = [
    "New RFQ received",
    `Request ID: ${payload.requestId}`,
    payload.requestTypeLabel ? `Request Type: ${payload.requestTypeLabel}` : null,
    `Company: ${payload.company || "-"}`,
    `Name: ${payload.name || "-"}`,
    payload.includeContactDetails === false
      ? null
      : `Phone: ${payload.phone || "-"}`,
    payload.includeContactDetails === false
      ? null
      : `Email: ${payload.email || "-"}`,
    `Items: ${payload.itemCount}`,
    ...(payload.extraLines ?? []).filter(
      (line): line is string => Boolean(String(line ?? "").trim()),
    ),
  ]
    .filter((line): line is string => Boolean(String(line ?? "").trim()))
    .join("\n");

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to,
      messages: [
        {
          type: "text",
          text,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LINE push failed: ${body}`);
  }
}
