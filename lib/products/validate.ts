import { Product, StockStatus } from "@/types/product";

const ALLOWED_STOCK: StockStatus[] = ["in_stock", "low_stock", "request"];

export type ProductValidationIssue = {
  index: number;
  field: string;
  message: string;
  product?: Partial<Product>;
};

function normalizeText(value: string): string {
  return value.trim();
}

function normalizePartNo(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

function normalizeId(value: string): string {
  return value.trim().toLowerCase();
}

export function validateProduct(
  product: Product,
  index: number
): ProductValidationIssue[] {
  const issues: ProductValidationIssue[] = [];

  if (!normalizeId(product.id || "")) {
    issues.push({
      index,
      field: "id",
      message: "id is required",
      product,
    });
  }

  if (!normalizePartNo(product.partNo || "")) {
    issues.push({
      index,
      field: "partNo",
      message: "partNo is required",
      product,
    });
  }

  if (!normalizeText(product.brand || "")) {
    issues.push({
      index,
      field: "brand",
      message: "brand is required",
      product,
    });
  }

  if (!normalizeText(product.category || "")) {
    issues.push({
      index,
      field: "category",
      message: "category is required",
      product,
    });
  }

  if (product.stockStatus && !ALLOWED_STOCK.includes(product.stockStatus)) {
    issues.push({
      index,
      field: "stockStatus",
      message: `stockStatus must be one of: ${ALLOWED_STOCK.join(", ")}`,
      product,
    });
  }

  if (product.officialUrl) {
    try {
      new URL(product.officialUrl);
    } catch {
      issues.push({
        index,
        field: "officialUrl",
        message: "officialUrl must be a valid URL",
        product,
      });
    }
  }

  if (product.imageUrl) {
    try {
      new URL(product.imageUrl);
    } catch {
      issues.push({
        index,
        field: "imageUrl",
        message: "imageUrl must be a valid URL",
        product,
      });
    }
  }

  if (product.refs && !Array.isArray(product.refs)) {
    issues.push({
      index,
      field: "refs",
      message: "refs must be string[]",
      product,
    });
  }

  if (Array.isArray(product.refs)) {
    const badRef = product.refs.find(
      (ref) => typeof ref !== "string" || !ref.trim()
    );

    if (badRef !== undefined) {
      issues.push({
        index,
        field: "refs",
        message: "refs must contain only non-empty strings",
        product,
      });
    }
  }

  return issues;
}

export function validateProducts(products: Product[]): ProductValidationIssue[] {
  const issues: ProductValidationIssue[] = [];
  const seenIds = new Map<string, number>();
  const seenPartNos = new Map<string, number>();

  products.forEach((product, index) => {
    issues.push(...validateProduct(product, index));

    const normalizedId = normalizeId(product.id || "");
    const normalizedPartNo = normalizePartNo(product.partNo || "");

    if (normalizedId) {
      if (seenIds.has(normalizedId)) {
        issues.push({
          index,
          field: "id",
          message: `duplicate id with row ${seenIds.get(normalizedId)}`,
          product,
        });
      } else {
        seenIds.set(normalizedId, index);
      }
    }

    if (normalizedPartNo) {
      if (seenPartNos.has(normalizedPartNo)) {
        issues.push({
          index,
          field: "partNo",
          message: `duplicate partNo with row ${seenPartNos.get(normalizedPartNo)}`,
          product,
        });
      } else {
        seenPartNos.set(normalizedPartNo, index);
      }
    }
  });

  return issues;
}