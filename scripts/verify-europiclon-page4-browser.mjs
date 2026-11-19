import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.QA_BASE_URL || 'http://localhost:3192';
const cases = [
  ['C14200', 'C 14 200', 'P780024'], ['P778984', 'P778984', 'CF 200'],
  ['CF200', 'CF 200', 'P778984'], ['P780024', 'P780024', 'C 14 200'],
  ['LAF8749', 'P778984', 'P780024'], ['RS3943', 'P780024', 'P778984'],
  ['P778989', 'C 15 300', 'P780030'], ['P780030', 'CF 300', 'P778989'],
];
const results = [];
fs.mkdirSync('output/europiclon-page4/browser', { recursive: true });
const browser = await chromium.launch();
try {
  await Promise.all(['th', 'en'].flatMap(locale => [390, 1440].map(async width => {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.addInitScript(() => localStorage.setItem('mrt_cookie_consent', 'rejected'));
    let rfqPosts = 0;
    await context.route('**/api/analytics/**', route => route.fulfill({ json: { ok: true } }));
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.fallback() : route.abort());
    await context.route('**/api/**', route => {
      if (route.request().method() === 'POST' && /rfq|quote/i.test(new URL(route.request().url()).pathname)) { rfqPosts++; return route.abort(); }
      return route.fallback();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [query, expected, excluded] of cases) {
      const response = await page.goto(`${base}/${locale}/products?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200);
      const href = `/${locale}/products/${encodeURIComponent(expected)}`;
      await page.locator(`a[href=${JSON.stringify(href)}]`).first().waitFor({ state: 'visible' });
      assert.equal(await page.locator(`a[href=${JSON.stringify(`/${locale}/products/${encodeURIComponent(excluded)}`)}]`).count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      results.push({ locale, width, query, expected, excluded, passed: true });
    }
    for (const part of ['P778984', 'P780024', 'C 14 200', 'CF 200']) {
      const response = await page.goto(`${base}/${locale}/products/${encodeURIComponent(part)}`, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200);
      const expected = part === 'P778984' ? ['C14200', 'RS3942', 'AF26389', 'LAF8749', '49462'] : part === 'P780024' ? ['CF200', 'RS3943', 'AF26390', 'LAF8750', '49463'] : [part === 'C 14 200' ? 'P778984' : 'P780024'];
      await page.waitForFunction(parts => parts.every(part => document.body.innerText.replace(/\s/g, '').includes(part)), expected);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.screenshot({ path: `output/europiclon-page4/browser/${part}-${locale}-${width}.png`, fullPage: true });
      results.push({ locale, width, part, references: expected, passed: true });
    }
    assert.equal(rfqPosts, 0);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(`PASS ${locale} ${width}: 8 searches, 4 product reference tables, zero RFQ POSTs`);
  })));
  fs.writeFileSync('output/europiclon-page4/browser/results.json', JSON.stringify(results, null, 2));
  console.log(`PASS ${results.length} local browser checks`);
} finally { await browser.close(); }
