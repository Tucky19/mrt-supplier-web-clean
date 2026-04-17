import { products } from "@/data/products";
import { validateProducts } from "@/lib/products/validate";

function main() {
  const issues = validateProducts(products);

  if (issues.length === 0) {
    console.log("✅ Product catalog validation passed");
    console.log(`Total products: ${products.length}`);
    process.exit(0);
  }

  console.error("❌ Product catalog validation failed");
  console.error(`Found ${issues.length} issue(s)\n`);

  for (const issue of issues) {
    console.error(
      `[row ${issue.index}] field="${issue.field}" message="${issue.message}"`
    );

    if (issue.product) {
      console.error(JSON.stringify(issue.product, null, 2));
    }

    console.error("----");
  }

  process.exit(1);
}

main();