import { products } from "@/data/products/index";
import { sortProductsByPartNo } from "@/lib/products/sort";

const sortedProducts = sortProductsByPartNo(products);
const expectedProducts = [...products].sort((a, b) =>
  a.partNo.localeCompare(b.partNo, undefined, {
    numeric: true,
    sensitivity: "base",
  }),
);

if (
  sortedProducts.some(
    (product, index) => product.partNo !== expectedProducts[index]?.partNo,
  )
) {
  throw new Error("Recommended products are not sorted by Part No.");
}

console.log("Recommended product Part No. ordering passed.");
