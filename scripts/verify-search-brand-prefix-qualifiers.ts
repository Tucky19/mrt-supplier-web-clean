import { searchProducts } from "@/lib/search/search";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertTopRelation(query: string, expectedPartNo: string) {
  const results = searchProducts(query, { limit: 20 });
  const [top] = results;

  assert(top?.partNo === expectedPartNo, `${query} should return ${expectedPartNo} first`);
  assert(
    top?._matchType === "Cross Ref" || top?._matchType === "Same-brand Ref",
    `${query} should remain a relation match`,
  );

  return results;
}

for (const query of [
  "50083040004",
  "50.08304-0004",
  "MAN 50083040004",
  "MAN 50.08304-0004",
]) {
  const results = assertTopRelation(query, "P181063");

  if (query.startsWith("MAN ")) {
    assert(
      !results.some((result) => result.partNo === "P778984"),
      `${query} should not treat MAN as a broad specification token`,
    );
  }
}

assertTopRelation("MANN & HUMMEL C24430", "P181080");
assertTopRelation("Fleetguard AF1735K", "P181063");

const ordinarySpecResults = searchProducts("OD 93", { limit: 50 });
assert(
  ordinarySpecResults.some(
    (result) => result.partNo === "P550388" && result._matchType === "Spec",
  ),
  "ordinary specification search should remain available",
);

const exactResults = searchProducts("P551315", { limit: 5 });
assert(
  exactResults[0]?.partNo === "P551315" && exactResults[0]?._matchType === "Exact",
  "exact product-number search should remain unchanged",
);

console.log("Brand-prefix search qualifier validation passed");
console.log("MAN relation queries no longer create the P778984 broad Spec result");
console.log("Relation, ordinary Spec, and exact searches remain available");
