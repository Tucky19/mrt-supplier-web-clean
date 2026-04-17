// data/search/server.ts
import { products } from "@/data/products";

export type MiniRec = {
  id: string;
  partNo: string;
  brand: string;
  title: string;
  category?: string;
};

type Index = {
  byId: Record<string, MiniRec>;
  partNoKey: Record<string, string>; // id -> norm(partNo)
  partNoCompact: Record<string, string>; // id -> compact(partNo)
  prefix2: Record<string, string[]>;
  prefix3: Record<string, string[]>;
  prefix4: Record<string, string[]>;
  tokens: Record<string, string[]>;
};

export function normKey(s: any) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-");
}

function normCompact(s: any) {
  return String(s ?? "")
    .toLowerCase()
    .trim()
    .replace(/[\s\-_\/]+/g, "");
}

function uniqPush(map: Record<string, string[]>, k: string, id: string) {
  if (!k) return;
  const arr = map[k];
  if (!arr) map[k] = [id];
  else if (arr[arr.length - 1] !== id) arr.push(id);
}

function tokenize(q: string) {
  const nk = normKey(q);
  if (!nk) return [];
  const toks = nk
    .split(/\s+/)
    .flatMap((x) => x.split(/-+/))
    .map((x) => x.trim())
    .filter((x) => x.length >= 2);
  return Array.from(new Set(toks));
}

let _index: Index | null = null;

function buildIndex(): Index {
  const byId: Record<string, MiniRec> = {};
  const partNoKey: Record<string, string> = {};
  const partNoCompact: Record<string, string> = {};
  const prefix2: Record<string, string[]> = {};
  const prefix3: Record<string, string[]> = {};
  const prefix4: Record<string, string[]> = {};
  const tokens: Record<string, string[]> = {};

  for (const p of products as any[]) {
    const id = String(p.id ?? "");
    if (!id) continue;

    const rec: MiniRec = {
      id,
      partNo: String(p.partNo ?? ""),
      brand: String(p.brand ?? ""),
      title:
        String(p.title ?? p.type ?? p.spec ?? "").trim() ||
        `${p.brand ?? ""} ${p.partNo ?? ""}`.trim(),
      category: p.category ? String(p.category) : undefined,
    };

    byId[id] = rec;

    const pnKey = normKey(rec.partNo);
    const pnComp = normCompact(rec.partNo);
    partNoKey[id] = pnKey;
    partNoCompact[id] = pnComp;

    // prefix buckets (ทั้งแบบมี - และแบบ compact)
    if (pnKey.length >= 2) uniqPush(prefix2, pnKey.slice(0, 2), id);
    if (pnKey.length >= 3) uniqPush(prefix3, pnKey.slice(0, 3), id);
    if (pnKey.length >= 4) uniqPush(prefix4, pnKey.slice(0, 4), id);

    if (pnComp.length >= 2) uniqPush(prefix2, pnComp.slice(0, 2), id);
    if (pnComp.length >= 3) uniqPush(prefix3, pnComp.slice(0, 3), id);
    if (pnComp.length >= 4) uniqPush(prefix4, pnComp.slice(0, 4), id);

    // token index: partNo/brand/title/type/spec/tags/refs
    const corpus = [
      rec.partNo,
      rec.brand,
      rec.title,
      p.type,
      p.spec,
      ...(Array.isArray(p.tags) ? p.tags : []),
      ...(Array.isArray(p.refs) ? p.refs : []),
    ]
      .filter(Boolean)
      .join(" ");

    for (const t of tokenize(corpus)) {
      uniqPush(tokens, t, id);
    }

    // token แบบ compact ของ partNo (เช่น 6205zz)
    if (pnComp.length >= 2) uniqPush(tokens, pnComp, id);
  }

  return { byId, partNoKey, partNoCompact, prefix2, prefix3, prefix4, tokens };
}

function getIndex() {
  if (!_index) _index = buildIndex();
  return _index;
}

export function searchProductsPRO(q: string, limit = 25): MiniRec[] {
  const idx = getIndex();

  const raw = String(q ?? "").trim();
  const nk = normKey(raw);
  const nc = normCompact(raw);
  if (nk.length < 2 && nc.length < 2) return [];

  const cand = new Set<string>();

  // 2 ตัว: ดึงจาก prefix2
  const key2 = nk.replace(/\s+/g, "").slice(0, 2);
  const comp2 = nc.slice(0, 2);
  for (const id of idx.prefix2[key2] || []) cand.add(id);
  for (const id of idx.prefix2[comp2] || []) cand.add(id);

  // 3/4 ตัว: เพิ่มความแม่น
  if (nc.length >= 3) for (const id of idx.prefix3[nc.slice(0, 3)] || []) cand.add(id);
  if (nk.replace(/\s+/g, "").length >= 3)
    for (const id of idx.prefix3[nk.replace(/\s+/g, "").slice(0, 3)] || []) cand.add(id);

  if (nc.length >= 4) for (const id of idx.prefix4[nc.slice(0, 4)] || []) cand.add(id);
  if (nk.replace(/\s+/g, "").length >= 4)
    for (const id of idx.prefix4[nk.replace(/\s+/g, "").slice(0, 4)] || []) cand.add(id);

  // token hits (แบรนด์/ชื่อ/สเปก)
  for (const t of tokenize(raw)) {
    for (const id of idx.tokens[t] || []) cand.add(id);
  }
  if (nc.length >= 2) {
    for (const id of idx.tokens[nc] || []) cand.add(id);
  }

  // scoring
  const scored: Array<{ id: string; s: number }> = [];
  const q2 = nk.replace(/\s+/g, "");
  for (const id of cand) {
    const rec = idx.byId[id];
    if (!rec) continue;

    const pnKey = idx.partNoKey[id] || "";
    const pnComp = idx.partNoCompact[id] || "";
    const brand = normKey(rec.brand);
    const title = normKey(rec.title);

    let s = 0;

    if (pnKey === nk) s += 1200;
    if (pnComp === nc) s += 1100;

    if (pnComp.startsWith(nc) && nc.length >= 2) s += 700;
    if (pnKey.replace(/\s+/g, "").startsWith(q2) && q2.length >= 2) s += 650;

    if (pnKey.includes(nk) && nk.length >= 2) s += 220;
    if (pnComp.includes(nc) && nc.length >= 2) s += 210;

    if (brand.includes(nk) && nk.length >= 2) s += 120;
    if (title.includes(nk) && nk.length >= 2) s += 90;

    if (s > 0) scored.push({ id, s });
  }

  scored.sort((a, b) => b.s - a.s);

  const out: MiniRec[] = [];
  const lim = Math.max(1, Math.min(200, Number(limit) || 25));
  for (const x of scored.slice(0, lim)) {
    const rec = idx.byId[x.id];
    if (rec) out.push(rec);
  }
  return out;
}
