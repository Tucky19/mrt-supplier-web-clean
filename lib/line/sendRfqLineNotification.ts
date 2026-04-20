export async function sendRfqLineNotification(payload: {
  requestId: string;
  company?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  itemCount: number;
}) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const to = process.env.LINE_TARGET_USER_ID;

  if (!token || !to) {
    throw new Error("LINE Messaging API config missing");
  }

  const text = [
    "มี RFQ ใหม่เข้า",
    `Request ID: ${payload.requestId}`,
    `Company: ${payload.company || "-"}`,
    `Name: ${payload.name || "-"}`,
    `Phone: ${payload.phone || "-"}`,
    `Email: ${payload.email || "-"}`,
    `Items: ${payload.itemCount}`,
  ].join("\n");

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