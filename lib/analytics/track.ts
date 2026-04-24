/**
 * MRT Supplier — Client Analytics Tracker
 * Purpose:
 * - Track search, product click, RFQ events
 * - Attach sessionId for conversion analysis
 * - Non-blocking (fail silently)
 */

type EventType = "search" | "click" | "rfq";

type TrackEventPayload = {
  type: EventType;
  query?: string;
  partNo?: string;
  productId?: string;
};

const SESSION_KEY = "mrt_session_id";

/**
 * Generate or retrieve persistent session ID
 */
function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }

    return id;
  } catch {
    // fallback (SSR / restricted env)
    return "unknown";
  }
}

/**
 * Send analytics event to backend
 */
export async function trackEvent(payload: TrackEventPayload) {
  try {
    const sessionId = getSessionId();

    await fetch("/api/analytics/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        sessionId,
        timestamp: Date.now(),
      }),
    });
  } catch {
    // silent fail — never break UX
  }
}