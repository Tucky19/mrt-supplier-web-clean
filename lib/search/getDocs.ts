import index from "@/data/search-index.v2.json";

export function getDocs() {
  const anyIndex: any = index;

  const docs =
    anyIndex?.items ??
    anyIndex?.docs ??
    anyIndex;

  if (!Array.isArray(docs)) return [];

  return docs;
}