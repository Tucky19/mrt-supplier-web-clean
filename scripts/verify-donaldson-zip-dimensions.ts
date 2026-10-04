import assert from 'node:assert/strict';
import { products } from '../data/products/index';
import evidence from '../data/products/donaldson-metric-2026-10-02.json';
import { getNormalizedDimensions, getSearchableLengths } from '../lib/search/dimensions';
import { searchFilterProductsByDimensions } from '../lib/search/search';

let searchable = 0;
for (const [pn, record] of Object.entries(evidence)) {
  const p = products.find(p => p.brand.toLowerCase() === 'donaldson' && p.partNo === pn)!;
  assert.ok(p, pn);
  for (const row of record.dimensions) assert.ok(p.specifications?.some(s => s.label === row.label && s.value === row.value), `${pn}: ${row.label}`);
  const dims = getNormalizedDimensions(p);
  assert.ok(searchFilterProductsByDimensions(dims, { category: 'all_products', limit: 800 }).some(item => item.partNo === pn), `${pn}: dimension search`);
  searchable++;
}
assert.equal(searchable, 88);
const round = products.find(p => p.partNo === 'P181039')!;
assert.equal(getNormalizedDimensions(round).lengthMm, 457.2);
assert.deepEqual(getSearchableLengths(round), [457.2, 469.9]);
const panel = products.find(p => p.partNo === 'P500138')!;
assert.equal(getNormalizedDimensions(panel).lengthMm, 220);
assert.equal(getNormalizedDimensions(panel).widthMm, 163);
assert.equal(getNormalizedDimensions(panel).outerDiameterMm, undefined);
assert.equal(getNormalizedDimensions(panel).innerDiameterMm, undefined);
console.log('Donaldson evidence: 88 dimension records verified; 88 products found by dimensions; special shapes preserved.');
