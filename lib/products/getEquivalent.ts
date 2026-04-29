function normalize(p: string) {
  return p.replace(/\s|\//g, "").toLowerCase();
}

export function getEquivalent(product: any, all: any[]) {
  if (!product.crossReferences?.length) return null;

  const refs = product.crossReferences.map(normalize);

  return all.find((p) =>
    refs.includes(normalize(p.partNo))
  );
}