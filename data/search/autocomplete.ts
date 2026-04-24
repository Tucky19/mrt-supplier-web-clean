import { products as catalogProducts } from "@/data/products/index";

export type AutocompleteItem = {
  id: string;
  partNo: string;
  brand?: string;
  category?: string;
  title?: string;
};

type ProductLike = {
  id?: string;
  partNo?: string;
  brand?: string;
  category?: string;
  title?: string;
  refs?: string[];
};

function normalize(value: string | undefined | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s/_-]+/g, "");
}

function scoreItem(product: ProductLike, query: string) {
  const q = normalize(query);
  if (!q || q.length < 2) return 0;

  const partNo = String(product.partNo ?? "");
  const brand = String(product.brand ?? "");
  const category = String(product.category ?? "");
  const title = String(product.title ?? "");
  const refs = Array.isArray(product.refs) ? product.refs : [];

  const partNoNorm = normalize(partNo);
  const brandNorm = normalize(brand);
  const categoryNorm = normalize(category);
  const titleNorm = normalize(title);
  const refsNorm = refs.map((ref) => normalize(ref));

  let score = 0;

  if (partNoNorm === q) score += 2000;
  else if (partNoNorm.startsWith(q)) score += 1200;
  else if (partNoNorm.includes(q)) score += 700;

  if (refsNorm.includes(q)) score += 1000;
  else if (refsNorm.some((ref) => ref.startsWith(q))) score += 650;
  else if (refsNorm.some((ref) => ref.includes(q))) score += 380;

  if (brandNorm.includes(q)) score += 180;
  if (titleNorm.includes(q)) score += 160;
  if (categoryNorm.includes(q)) score += 100;

  const tokenBlob = [partNo, brand, category, title, ...refs]
    .map(normalize)
    .join(" ");

  if (tokenBlob.includes(q)) score += 40;

  return score;
}

export function autocompleteProducts(
  query: string,
  limit = 8
): AutocompleteItem[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const seen = new Set<string>();

  return catalogProducts
    .map((product) => ({
      product,
      score: scoreItem(product, query),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.product.partNo ?? "").localeCompare(
        String(b.product.partNo ?? "")
      );
    })
    .map(({ product }) => ({
      id: String(product.id ?? product.partNo ?? ""),
      partNo: String(product.partNo ?? ""),
      brand: product.brand,
      category: product.category,
      title: product.title,
    }))
    .filter((item) => {
      const key = normalize(item.partNo);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}