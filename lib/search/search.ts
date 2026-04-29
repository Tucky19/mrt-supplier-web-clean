import { products } from '@/data/products/index';
import { synonyms } from '@/data/synonyms';

export type Product = {
  id: string;
  partNo: string;
  brand: string;
  title?: string;
  spec?: string;
  refs?: string[];
  crossReferences?: string[];
};

export type SearchResult = Product & {
  _score: number;
  _matchType: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[\s\-_/]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function uniqueNormalized(values: string[]) {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function buildQueryVariants(query: string) {
  const variants = new Set([query]);

  for (const key in synonyms) {
    if (!query.includes(normalize(key))) continue;

    for (const synonym of synonyms[key]) {
      variants.add(normalize(synonym));
    }
  }

  return Array.from(variants);
}

export function searchProducts(
  q: string,
  { limit = 50 }: { limit?: number } = {}
): SearchResult[] {
  const catalog = Array.isArray(products) ? products : [];
  const query = normalize(q);

  if (!query) return [];

  const queryVariants = buildQueryVariants(query);

  const scored: SearchResult[] = catalog.map((item: Product) => {
    let score = 0;
    let matchType = '';

    const part = normalize(item.partNo);
    const brand = normalize(item.brand);
    const title = normalize(item.title ?? '');
    const spec = normalize(item.spec ?? '');
    const refs = uniqueNormalized([
      ...(item.refs ?? []),
      ...(item.crossReferences ?? []),
    ]);

    if (part === query) {
      score += 10000;
      matchType = 'Exact';
    } else if (part.startsWith(query)) {
      score += 8000;
      matchType = 'Prefix';
    } else if (queryVariants.some((variant) => part.includes(variant))) {
      score += 5000;
      matchType = 'Contains';
    }

    if (refs.some((ref) => ref === query)) {
      score += 7000;
      if (!matchType) matchType = 'Cross Ref';
    } else if (refs.some((ref) => ref.startsWith(query))) {
      score += 6500;
      if (!matchType) matchType = 'Cross Ref';
    } else if (
      refs.some((ref) => queryVariants.some((variant) => ref.includes(variant)))
    ) {
      score += 6000;
      if (!matchType) matchType = 'Cross Ref';
    }

    if (title.includes(query)) {
      score += title.startsWith(query) ? 1800 : 1200;
      if (!matchType) matchType = 'Title';
    }

    if (spec.includes(query)) {
      score += spec.startsWith(query) ? 1100 : 800;
      if (!matchType) matchType = 'Spec';
    }

    if (brand === query) {
      score += 900;
      if (!matchType) matchType = 'Brand';
    } else if (brand.startsWith(query)) {
      score += 700;
      if (!matchType) matchType = 'Brand';
    }

    if (part.includes(query) && query.length >= 4) {
      score += 500;
    }

    return {
      ...item,
      _score: score,
      _matchType: matchType,
    };
  });

  return scored
    .filter((item) => item._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;

      const aPart = normalize(a.partNo);
      const bPart = normalize(b.partNo);
      const aDistance = Math.abs(aPart.length - query.length);
      const bDistance = Math.abs(bPart.length - query.length);

      if (aDistance !== bDistance) return aDistance - bDistance;

      return a.partNo.localeCompare(b.partNo);
    })
    .slice(0, limit);
}

export function searchFallback(q: string, limit = 5): Product[] {
  const query = normalize(q);
  if (!query) return [];

  const catalog = Array.isArray(products) ? products : [];

  return catalog
    .map((item: Product) => {
      const part = normalize(item.partNo);
      let similarity = 0;

      if (part.includes(query)) similarity += 5;
      similarity += Math.max(0, 10 - Math.abs(part.length - query.length));

      return { item, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((entry) => entry.item);
}
