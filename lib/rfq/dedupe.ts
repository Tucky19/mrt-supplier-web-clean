import { getRfqReferenceContextKey } from "@/lib/rfq/referenceContext";

type RfqLite = {
  customer?: {
    phone?: string | null;
    email?: string | null;
    lineId?: string | null;
  };
  items?: Array<{
    partNo?: string | null;
    qty?: number | null;
    meta?: unknown;
  }>;
};

export function isSameRfqLite(a: RfqLite, b: RfqLite): boolean {
  const aContact = a.customer ?? {};
  const bContact = b.customer ?? {};
  const sameContact =
    (aContact.phone || "") === (bContact.phone || "") &&
    (aContact.email || "") === (bContact.email || "") &&
    (aContact.lineId || "") === (bContact.lineId || "");

  const aItems = Array.isArray(a.items) ? a.items : [];
  const bItems = Array.isArray(b.items) ? b.items : [];
  if (aItems.length !== bItems.length) return false;

  const normalize = (items: RfqLite["items"] = []) =>
    items
      .map((item) => ({
        partNo: String(item.partNo ?? "").trim(),
        qty: Number(item.qty ?? 0),
        referenceContext: getRfqReferenceContextKey(item.meta),
      }))
      .sort((left, right) =>
        (left.partNo + left.qty + left.referenceContext).localeCompare(
          right.partNo + right.qty + right.referenceContext,
        ),
      );

  const left = normalize(aItems);
  const right = normalize(bItems);
  return (
    sameContact &&
    left.every(
      (item, index) =>
        item.partNo === right[index].partNo &&
        item.qty === right[index].qty &&
        item.referenceContext === right[index].referenceContext,
    )
  );
}

export function findSameRfqLite<T extends RfqLite>(
  candidates: T[],
  incoming: RfqLite,
): T | undefined {
  return candidates.find((candidate) => isSameRfqLite(candidate, incoming));
}
