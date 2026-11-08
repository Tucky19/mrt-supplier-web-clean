// Keep the original request and response intact: client IP, trace ID and
// Retry-After must survive the legacy endpoint without another HTTP hop.
export { POST } from "../rfq/submit/route";

export const dynamic = "force-dynamic";
