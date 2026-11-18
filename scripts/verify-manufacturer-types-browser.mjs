import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.QA_BASE_URL || 'http://localhost:3191';
const cases = {
  P554004: 'LUBE FILTER', P553000: 'LUBE FILTER', P550520: 'LUBE FILTER', P502007: 'LUBE FILTER',
  P551864: 'FUEL FILTER', P550440: 'FUEL FILTER', P551315: 'FUEL FILTER',
  P550903: 'FUEL FILTER', P550958: 'FUEL FILTER', P181080: 'AIR FILTER', P784473: 'AIR FILTER',
};
(async () => {
  const browser = await chromium.launch();
  const results = [];
  fs.mkdirSync('output/playwright/manufacturer-types', { recursive: true });
  try {
    await Promise.all(['th', 'en'].flatMap(locale => [390, 1440].map(width => ({ locale, width }))).map(async ({ locale, width }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      let rfqPosts = 0;
      await context.route('**/api/analytics/**', route => route.fulfill({ json: { ok: true } }));
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.fallback() : route.abort());
      await context.route('**/api/rfq**', route => {
        if (route.request().method() === 'POST') { rfqPosts++; return route.abort(); }
        return route.continue();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const [partNo, label] of Object.entries(cases)) {
        for (const flow of ['search', 'detail']) {
          const path = flow === 'search' ? `/products?q=${partNo}` : `/products/${partNo}`;
          const response = await page.goto(`${base}/${locale}${path}`, { waitUntil: 'networkidle' });
          assert.equal(response.status(), 200);
          const reject = page.getByRole('button', { name: locale === 'th' ? 'ปฏิเสธคุกกี้วิเคราะห์และการตลาด' : 'Reject analytics and advertising cookies', exact: true });
          if (await reject.isVisible()) await reject.click();
          assert.ok((await page.locator('body').innerText()).includes(label), `${locale} ${partNo} ${flow}`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          if (partNo === 'P554004') await page.screenshot({ path: `output/playwright/manufacturer-types/${locale}-${width}-${flow}.png`, fullPage: true });
          await page.evaluate(() => localStorage.removeItem('mrt_quote_v1'));
          // Reload ensures the quote provider starts empty for each independent flow.
          await page.reload({ waitUntil: 'networkidle' });
          await page.getByRole('button', { name: locale === 'th' ? 'เพิ่มใน RFQ' : 'Add to Quote', exact: true }).filter({ visible: true }).first().click();
          await page.goto(`${base}/${locale}/quote`, { waitUntil: 'networkidle' });
          await page.waitForFunction(p => document.body.innerText.includes(p), partNo);
          const items = await page.evaluate(() => JSON.parse(localStorage.getItem('mrt_quote_v1')));
          assert.equal(items.length, 1);
          assert.equal(items[0].partNo, partNo);
          assert.equal(items[0].qty, 1);
          assert.ok((await page.locator('body').innerText()).includes(label));
          await page.reload({ waitUntil: 'networkidle' });
          await page.waitForFunction(p => document.body.innerText.includes(p), partNo);
          assert.ok((await page.locator('body').innerText()).includes(label));
          assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('mrt_quote_v1'))), items);
          results.push({ partNo, locale, width, flow, label, persisted: true });
        }
      }
      for (const [partNo, expected] of [['P502649', locale === 'th' ? 'OAT' : 'OAT coolant concentrate'], ['W 962/14', 'MANN']]) {
        const response = await page.goto(`${base}/${locale}/products/${encodeURIComponent(partNo)}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const text = await page.locator('body').innerText();
        assert.ok(text.includes(expected));
        assert.ok(!text.includes('LUBE FILTER'), `${partNo} must not inherit Donaldson lube wording`);
      }
      assert.equal(rfqPosts, 0);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`PASS ${locale} ${width}: 22 persisted quote flows plus coolant/MANN controls`);
    }));
    fs.writeFileSync('output/playwright/manufacturer-types/results.json', JSON.stringify(results, null, 2));
    console.log(`PASS ${results.length} TH/EN mobile/desktop search/detail-to-quote reload cases; zero RFQ POSTs`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
