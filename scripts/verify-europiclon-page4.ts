import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { products } from "@/data/products/index";
import { applyEuropiclonPage4, europiclonPage4Rows, europiclonPrimaryRows, europiclonSafetyRows, europiclonColumnBrands, europiclonPartKey, europiclonPage4Source } from "@/data/products/europiclon-page4";
import { normalizeProductRelations, type ProductRelationInput } from "@/lib/products/relations";
import { searchProducts } from "@/lib/search/search";
import type { Product } from "@/types/product";

const brandKey = (value: string) => /^(mann|mannfilter|mannhummel)$/.test(value.toLowerCase().replace(/[^a-z0-9]/g, "")) ? "mann" : value.toLowerCase().replace(/[^a-z0-9]/g, "");
const same = (product: Product, brand: string, part: string) => brandKey(product.brand) === brandKey(brand) && europiclonPartKey(product.partNo) === europiclonPartKey(part);
function match(value: ProductRelationInput, brand: string, part: string) {
  if (typeof value !== "string") return (!value.brand || brandKey(String(value.brand)) === brandKey(brand)) && europiclonPartKey(String(value.partNumber ?? value.partNo)) === europiclonPartKey(part);
  const tokens = value.split(":");
  return europiclonPartKey(tokens.at(-1)!) === europiclonPartKey(part) && (tokens.length === 1 || brandKey(tokens[0]) === brandKey(brand));
}
async function main() {
  assert.equal(europiclonPrimaryRows.length, 19);
  assert.equal(europiclonSafetyRows.length, 9);
  assert.equal(new Set(europiclonPage4Rows.map(row => row.parts[0])).size, 28);
  const temporary = path.resolve(`data/products/index.europiclon-baseline-${process.pid}.ts`);
  assert.ok(!fs.existsSync(temporary));
  fs.writeFileSync(temporary, execFileSync("git", ["show", "11876f7177ca05bc20321683a50099e23a2e5a44:data/products/index.ts"]));
  let baseline: Product[];
  try { baseline = (await import(pathToFileURL(temporary).href)).products; }
  finally { fs.unlinkSync(temporary); }
  assert.equal(products.length, baseline.length);
  let changedProducts = 0;
  for (const product of products) {
    const before = baseline.find(item => item.id === product.id)!;
    assert.ok(before);
    const withoutRelations = (value: Product) => { const copy = { ...value }; delete copy.refs; delete copy.crossReferences; return copy; };
    assert.deepEqual(withoutRelations(product), withoutRelations(before), `${product.partNo}: specs, stock, prices, applications and pairs must not change`);
    assert.deepEqual(applyEuropiclonPage4(product), product, `${product.partNo}: idempotence`);
    if (JSON.stringify(product) !== JSON.stringify(before)) changedProducts++;
  }
  type IndexDocument = { id: string; refs: string[]; crossReferences: string[] };
  type Index = { items: IndexDocument[]; xrefIndex: Record<string, string[]> };
  const oldIndex = JSON.parse(execFileSync("git", ["show", "11876f7177ca05bc20321683a50099e23a2e5a44:data/search-index.v2.json"], { maxBuffer: 20_000_000 }).toString()) as Index;
  const currentIndex = JSON.parse(fs.readFileSync("data/search-index.v2.json", "utf8")) as Index;
  for (const document of currentIndex.items) {
    const previous = oldIndex.items.find(item => item.id === document.id)!;
    assert.ok(previous);
    assert.deepEqual({ ...document, refs: undefined, crossReferences: undefined }, { ...previous, refs: undefined, crossReferences: undefined }, `${document.id}: unrelated indexed fields must remain unchanged`);
  }
  let directedPresent = 0, directedNew = 0;
  const served = new Set<string>();
  const alreadyPresent = new Set<string>();
  const rows = europiclonPage4Rows.map(row => {
    const endpoints = row.parts.flatMap((part, column) => part ? products.filter(product => same(product, europiclonColumnBrands[column], part)).map(product => ({ product, column })) : []);
    for (const { product, column } of endpoints) {
      const before = baseline.find(item => item.id === product.id)!;
      const targets = column === 0 ? row.parts.map((part, index) => ({ part, index })).slice(1) : [{ part: row.parts[0], index: 0 }];
      for (const { part, index } of targets) {
        if (!part) continue;
        const brand = europiclonColumnBrands[index];
        const relations = (product.crossReferences ?? []).filter(value => match(value, brand, part));
        assert.equal(relations.length, 1, `${product.partNo} -> ${brand} ${part}: canonical dedupe`);
        const [relation] = normalizeProductRelations(relations, "unknown");
        assert.equal(relation.verificationStatus, "verified");
        assert.equal(relation.relationType, "equivalent");
        assert.equal(relation.evidenceUrl, europiclonPage4Source.url);
        assert.ok(relation.evidenceNote?.includes(`${row.role} row ${row.row}`));
        assert.equal((product.refs ?? []).filter(value => match(value, brand, part)).length, 0);
        assert.ok(currentIndex.xrefIndex[europiclonPartKey(part)]?.includes(product.id), `${product.partNo} -> ${part}: generated index`);
        const present = [...(before.refs ?? []), ...(before.crossReferences ?? [])].some(value => match(value, brand, part));
        if (present) directedPresent++; else directedNew++;
        const sourceEdge = `${row.parts[0]}|${column === 0 ? index : column}`;
        served.add(sourceEdge);
        if (present) alreadyPresent.add(sourceEdge);
      }
      // Only the manufacturer-listed direct star edges receive this source.
      for (const relation of normalizeProductRelations(product.crossReferences, "unknown").filter(value => value.source === europiclonPage4Source.publication)) {
        assert.ok(targets.some(target => target.part && match(relation, europiclonColumnBrands[target.index], target.part)));
        assert.notEqual(relation.partNumber, "DBA5207");
      }
    }
    return { role: row.role, row: row.row, donaldson: row.parts[0], activeEndpoints: endpoints.map(({ product }) => product.partNo), held: endpoints.length === 0 };
  });
  const sample = products.find(product => product.partNo === "P778984")!;
  for (const status of ["rejected", "hidden"] as const) {
    const guarded = applyEuropiclonPage4({ ...sample, refs: [], crossReferences: [{ partNumber: "C14200", brand: "MANN-FILTER", relationType: "equivalent", verificationStatus: status }] });
    const target = normalizeProductRelations(guarded.crossReferences, "unknown").filter(value => europiclonPartKey(value.partNumber) === "c14200");
    assert.equal(target.length, 1);
    assert.equal(target[0].verificationStatus, status, "explicit contrary decisions must remain held");
  }
  for (const [query, expected, excluded] of [["C14200", "P778984", "P780024"], ["P778984", "C 14 200", "CF 200"], ["CF200", "P780024", "P778984"], ["P780024", "CF 200", "C 14 200"], ["LAF8749", "P778984", "P780024"], ["RS3943", "P780024", "P778984"]]) {
    const results = searchProducts(query, { limit: 1000 });
    assert.ok(results.some(product => product.partNo === expected), `${query} -> ${expected}`);
    assert.ok(!results.some(product => product.partNo === excluded), `${query}: primary/safety boundary`);
  }
  let pdfRowsChecked = 0;
  const dimensionDifferences: unknown[] = [];
  if (process.env.EUROPICLON_PAGE4_TEXT) {
    const text = fs.readFileSync(process.env.EUROPICLON_PAGE4_TEXT, "utf8");
    const [primary, safety] = text.split(/SAFETY\s+FILTER\s+CROSS\s+REFERENCE/);
    const parse = (section: string) => [...section.matchAll(/^\s*(P\d{6})\s+(CF?\d+)\s+(RS\d+)\s+(AF\d+|—)\s+(LAF\d+|—)\s+((?:WA)?\d+|—)/gm)].map(match => match.slice(1).map(value => value === "—" ? null : value));
    assert.deepEqual(parse(primary), europiclonPrimaryRows, "all primary cells must match actual PDF page 4");
    assert.deepEqual(parse(safety), europiclonSafetyRows, "all safety cells must match actual PDF page 4");
    pdfRowsChecked = 28;
    for (const dim of text.matchAll(/\b(P\d{6}\*?|DBA5207\*\*)\s+(\d+\.\d+)\s*\/\s*(\d+)\s+(\d+\.\d+)\s*\/\s*(\d+)\s+(\d+\.\d+)\s*\/\s*(\d+)/g)) {
      const part = dim[1] === "DBA5207**" ? "P782106" : dim[1].replace(/\*/g, "");
      assert.notEqual(part, "P782937", "P782937 has no dimension row");
      const product = baseline.find(item => same(item, "Donaldson", part));
      if (!product) continue;
      for (const [field, sourceMm, labels] of [["ID", Number(dim[3]), /^(inner|inside) diameter$|^id$/i], ["OD", Number(dim[5]), /^(outer|outside) diameter$|^od$/i], ["Length", Number(dim[7]), /^(overall )?length$|^height$/i]] as const) {
        const current = (product.specifications ?? []).filter(spec => labels.test(spec.label)).map(spec => ({ label: spec.label, value: spec.value, mm: Number(String(spec.value).match(/^\s*(\d+(?:\.\d+)?)/)?.[1]) })).filter(spec => Number.isFinite(spec.mm));
        if (current.some(spec => spec.mm !== sourceMm)) dimensionDifferences.push({ part, field, sourceMm, current, classification: current.length > 1 ? "ambiguous dimension semantics; preserve" : current.every(spec => Math.abs(spec.mm - sourceMm) <= 0.5) ? "source rounding; preserve precision" : "conflict; preserve pending review" });
      }
    }
  }
  const sourceEdges = europiclonPage4Rows.reduce((sum, row) => sum + row.parts.slice(1).filter(Boolean).length, 0);
  const overlaps = (catalog: Product[]) => new Set(catalog.flatMap(product => {
    const refs = new Set(normalizeProductRelations(product.refs, "unknown").map(value => europiclonPartKey(value.partNumber)));
    return normalizeProductRelations(product.crossReferences, "unknown").filter(value => refs.has(europiclonPartKey(value.partNumber))).map(value => `${product.id}|${europiclonPartKey(value.partNumber)}`);
  }));
  const oldOverlaps = overlaps(baseline), currentOverlaps = overlaps(products);
  assert.ok([...currentOverlaps].every(value => oldOverlaps.has(value)), "no new legacy refs/cross-reference overlaps");
  const report = { baseline: "11876f7177ca05bc20321683a50099e23a2e5a44", source: europiclonPage4Source, primaryRows: 19, safetyRows: 9, pdfRowsChecked, sourceEdges, alreadyPresentSourceEdges: alreadyPresent.size, newSourceEdges: served.size - alreadyPresent.size, servedSourceEdges: served.size, heldSourceEdges: sourceEdges - served.size, directedPresent, directedNew, changedProducts, activeProducts: products.length, baselineOverlaps: oldOverlaps.size, remainingOverlaps: currentOverlaps.size, heldRows: rows.filter(row => row.held).length, rows, dimensionDifferences };
  fs.mkdirSync("output/europiclon-page4", { recursive: true });
  fs.writeFileSync("output/europiclon-page4/audit.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, rows: undefined, dimensionDifferences: dimensionDifferences.length }, null, 2));
  console.log("PASS: all source rows classified; direct canonical edges, dedupe, contrary-decision holds, immutable non-relation data and bidirectional searches");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
