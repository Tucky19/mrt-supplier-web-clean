import {
  parseMultiPartInputs,
  parseMultiPartText,
} from "@/lib/search/multiPartInput";
import { focusSearchResults, searchProducts } from "@/lib/search/search";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const pastedRows = parseMultiPartText(
  "P551315\t2\nAF25555\t1\nCR522 x 3\nP551315,4\nC 20 500",
);
assert(pastedRows.length === 4, "Excel/text rows should parse and deduplicate");
assert(
  pastedRows.find((row) => row.normalizedPartNo === "p551315")?.qty === 6,
  "duplicate quantities should be merged",
);
assert(
  pastedRows.find((row) => row.normalizedPartNo === "c20500")?.qty === 1,
  "spaced Part Numbers must not be mistaken for a quantity",
);

const apiRows = parseMultiPartInputs([
  { partNo: "50.08304-0004", qty: 2 },
  "AF25555 x 3",
]);
assert(
  apiRows[0]?.normalizedPartNo === "50083040004",
  "punctuation normalization failed",
);
assert(apiRows[1]?.qty === 3, "string quantity parsing failed");

function exactLookup(partNo: string) {
  return focusSearchResults(searchProducts(partNo, { limit: 25 })).filter(
    (item) =>
      ["Exact", "Cross Ref", "Same-brand Ref", "Kit Component"].includes(
        item._matchType,
      ),
  );
}

assert(
  exactLookup("P551315")[0]?.partNo === "P551315",
  "exact Part Number failed",
);
assert(
  exactLookup("AF25555")[0]?.partNo === "P827653",
  "Fleetguard reference failed",
);
assert(exactLookup("CR522")[0]?.partNo === "P556245", "Wix reference failed");
assert(
  exactLookup("A5008340004")[0]?.partNo === "P181063",
  "MANN reference failed",
);
assert(
  exactLookup("FS1006").length === 3,
  "ambiguous reference must remain ambiguous",
);
assert(
  exactLookup("AF2").length === 0,
  "partial reference must not become an exact bulk result",
);

console.log("Multi-part search verification passed.");
