export function track(event: {
  type: 'search' | 'click_result' | 'add_to_quote';
  query?: string;
  partNo?: string;
  matchType?: string;
  resultCount?: number;
}) {
  // fire-and-forget
  fetch('/api/analytics/search', {
    method: 'POST',
    body: JSON.stringify(event),
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
  }).catch(() => {});
}