type Bucket = { hits: number[] }; // timestamps
const store = new Map<string, Bucket>();

function now() {
  return Date.now();
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const t = now();
  const b = store.get(key) || { hits: [] };

  // prune old hits
  const cutoff = t - windowMs;
  b.hits = b.hits.filter((x) => x > cutoff);

  const allowed = b.hits.length < limit;
  if (allowed) b.hits.push(t);

  store.set(key, b);

  return { allowed, remaining: Math.max(0, limit - b.hits.length) };
}
