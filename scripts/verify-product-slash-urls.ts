import assert from "node:assert/strict";
import { products } from "../data/products/index";
import { GET } from "../app/[locale]/products/[...partNo]/route";

// Run with tsx. With a base URL, also exercise the built app over HTTP.
async function main() {
  const base = process.argv[2];
  const slashProducts = products.filter((product) => product.partNo.includes("/"));
  assert(slashProducts.some((product) => product.partNo === "W 962/14"));
  let checks = 0;
  for (const locale of ["th", "en"]) {
    for (const product of slashProducts) {
      const segments = product.partNo.split("/");
      const canonical = `/${locale}/products/${encodeURIComponent(product.partNo)}`;
      const path = `/${locale}/products/${segments.map(encodeURIComponent).join("/")}`;
      const response = base
        ? await fetch(`${base}${path}`, { redirect: "manual" })
        : await GET(new Request(`http://localhost${path}`), {
            params: Promise.resolve({ locale, partNo: segments }),
          });
      assert.equal(response.status, 308, path);
      assert.equal(new URL(response.headers.get("location")!, base || "http://localhost").pathname, canonical, path);
      if (base) {
        const target = await fetch(`${base}${canonical}`, { redirect: "manual" });
        assert.equal(target.status, 200, canonical);
        const html = await target.text();
        for (const [lang, url] of [
          ["canonical", `https://www.mrtsupplier.com${canonical}`],
          ["th", `https://www.mrtsupplier.com/th/products/${encodeURIComponent(product.partNo)}`],
          ["en", `https://www.mrtsupplier.com/en/products/${encodeURIComponent(product.partNo)}`],
          ["x-default", `https://www.mrtsupplier.com/th/products/${encodeURIComponent(product.partNo)}`],
        ]) {
          const links = html.match(/<link\b[^>]*>/g) || [];
          assert(links.some((link) => link.includes(`href="${url}"`) &&
            (lang === "canonical" ? link.includes('rel="canonical"') : link.includes(`hrefLang="${lang}"`))), `${canonical}: ${lang}`);
        }
      }
      checks++;
    }
    // No fuzzy normalization: added slashes must not turn an invalid code into a valid one.
    for (const segments of [
      ["W 962", "999999"], ["W 962", "14", "extra"], ["P181", "080"],
      ["W 962", "1", "4"], ["W%20962", "999999"], ["W 962", "%2F14"],
      ["unknown", "product"], ["W 962 ", "14"],
    ]) {
      const path = `/${locale}/products/${segments.map(encodeURIComponent).join("/")}`;
      const response = base
        ? await fetch(`${base}${path}`, { redirect: "manual" })
        : await GET(new Request(`http://localhost${path}`), {
            params: Promise.resolve({ locale, partNo: segments }),
          });
      assert.equal(response.status, 404, path);
      checks++;
    }
  }
  // Mixed decoded/encoded separators, even when no current SKU has multiple slashes.
  for (const segments of [["A", "B/C"], ["A/B", "C"], ["A", "B", "C"], ["W 962", ""]]) {
    const path = `/th/products/${segments.map(encodeURIComponent).join("/")}`;
    const response = base && segments.every(Boolean)
      ? await fetch(`${base}${path}`, { redirect: "manual" })
      : await GET(new Request(`http://localhost${path}`), {
      params: Promise.resolve({ locale: "th", partNo: segments }),
    });
    assert.equal(response.status, 404);
    checks++;
  }
  const response = await GET(new Request("http://localhost/th/products/W%20962/14?utm_source=gsc"), {
    params: Promise.resolve({ locale: "th", partNo: ["W 962", "14"] }),
  });
  assert.equal(response.headers.get("location"), "/th/products/W%20962%2F14?utm_source=gsc");
  if (base) {
    for (const locale of ["th", "en"]) {
      // next-intl normalizes an extra encoded space before route params are resolved.
      const doubleSpace = await fetch(`${base}/${locale}/products/W%2520962/14`, { redirect: "manual" });
      assert.equal(doubleSpace.status, 308);
      assert.equal(new URL(doubleSpace.headers.get("location")!, base).pathname, `/${locale}/products/W%20962%2F14`);
      const lowerEscape = await fetch(`${base}/${locale}/products/W%20962%2f14`, { redirect: "manual" });
      assert.equal(lowerEscape.status, 200);
      const inspected = await fetch(`${base}/${locale}/products/W%20962/14?utm_source=gsc`, {
        redirect: "manual", headers: { "User-Agent": "Google-InspectionTool/1.0" },
      });
      assert.equal(inspected.status, 308);
      assert.equal(new URL(inspected.headers.get("location")!, base).search, "?utm_source=gsc");
      const ordinary = await fetch(`${base}/${locale}/products/P181080`, { redirect: "manual" });
      assert.equal(ordinary.status, 200);
      const dimensions = await fetch(`${base}/${locale}/products/dimensions`, { redirect: "manual" });
      assert.equal(dimensions.status, 200);
      checks += 5;
    }
  }
  console.log(JSON.stringify({ mode: base || "handler", slashProducts: slashProducts.length, checks: checks + 1, result: "PASS" }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
