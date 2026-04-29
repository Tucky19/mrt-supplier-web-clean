export function trackEvent(name: string, payload?: any) {
  const event = {
    name,
    payload,
    ts: Date.now(),
  };

  console.log("[TRACK]", event);

  // 🔥 เก็บ local
  const prev = JSON.parse(localStorage.getItem("analytics") || "[]");
  prev.push(event);

  localStorage.setItem("analytics", JSON.stringify(prev));
}