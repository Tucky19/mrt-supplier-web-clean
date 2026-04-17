import { products } from "@/data/products/index";
import {
  buildPartKeys,
  canonicalPart,
  digitsOnly,
  normalizePart,
} from "./normalize";

type Product = (typeof products)[number];

export const partIndex = new Map<string, Product>();
export const prefixIndex = new Map<string, Product[]>();
export const digitIndex = new Map<string, Product[]>();
export const crossRefIndex = new Map<string, Product[]>();

function pushMapArray<K, V extends { id?: string }>(
  map: Map<K, V[]>,
  key: K,
  value: V
) {
  const arr = map.get(key) ?? [];

  if (!arr.some((item) => item?.id === value?.id)) {
    arr.push(value);
    map.set(key, arr);
  }
}

const seenPart = new Set<string>();

for (const p of products) {
  const id = String(p.id ?? "").trim();
  const partNo = String(p.partNo ?? "").trim();

  if (!id || !partNo) continue;

  const dedupeKey = canonicalPart(partNo);
  if (!dedupeKey || seenPart.has(dedupeKey)) continue;
  seenPart.add(dedupeKey);

  const keys = buildPartKeys(partNo);
  const partDigits = digitsOnly(partNo);

  for (const key of keys) {
    if (!partIndex.has(key)) {
      partIndex.set(key, p);
    }

    for (let i = 2; i <= key.length; i++) {
      pushMapArray(prefixIndex, key.slice(0, i), p);
    }
  }

  if (partDigits.length >= 2) {
    for (let i = 2; i <= partDigits.length; i++) {
      pushMapArray(digitIndex, partDigits.slice(0, i), p);
    }
  }

  for (const ref of p.refs ?? []) {
    const refKey = normalizePart(ref);
    if (!refKey) continue;

    pushMapArray(crossRefIndex, refKey, p);

    for (let i = 2; i <= refKey.length; i++) {
      pushMapArray(crossRefIndex, refKey.slice(0, i), p);
    }
  }
}