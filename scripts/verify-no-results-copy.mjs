import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import next from 'next';
import { chromium } from 'playwright';

// With no argument, exercise the local Preview-mode production build.
// Optional hosted Preview URL and PREVIEW_ACCESS_URL authenticate via a temporary
// share link. Never point this script at Production or provide live credentials.
let app, server;
const base = process.argv[2] || 'http://127.0.0.1:3102';
if (!process.argv[2]) {
  process.env.VERCEL_ENV = 'preview';
  app = next({ dev: false, hostname: '127.0.0.1', port: 3102 });
  await app.prepare();
  server = http.createServer(app.getRequestHandler());
  await new Promise(resolve => server.listen(3102, '127.0.0.1', resolve));
}
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const output = process.env.QA_OUTPUT || '/tmp/mrt-no-results-copy';
await fs.mkdir(output, { recursive: true });
const results = [];
const query = '  ZZNOTFOUND  ทดสอบ /14 + & # % " < >  ';
try {
  for (const locale of ['th', 'en']) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 950 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      if (process.env.PREVIEW_ACCESS_URL) await page.goto(process.env.PREVIEW_ACCESS_URL);
      await context.addInitScript(() => localStorage.setItem('mrt_cookie_consent', 'rejected'));
      // No customer submissions, analytics transport or LINE navigation.
      await context.route('**/*', route => {
        const request = route.request();
        if (new URL(request.url()).origin !== new URL(base).origin || !['GET', 'HEAD'].includes(request.method())) return route.abort();
        return route.continue();
      });
      const label = locale === 'th' ? 'คัดลอกคำค้น' : 'Copy search text';
      for (const mode of ['success', 'denied', 'unavailable']) {
        await page.goto(`${base}/${locale}/products?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle' });
        const button = page.getByRole('button', { name: label, exact: true });
        await button.waitFor();
        await page.evaluate(mode => {
          window.__copiedQuery = null;
          Object.defineProperty(navigator, 'clipboard', { configurable: true, value: mode === 'unavailable' ? undefined : {
            writeText: async value => {
              if (mode === 'denied') throw new DOMException('Denied', 'NotAllowedError');
              window.__copiedQuery = value;
            },
          } });
        }, mode);
        await button.focus();
        await page.keyboard.press('Enter');
        const feedback = page.locator(`[id="${await button.getAttribute('aria-describedby')}"]`);
        await page.waitForFunction(() => !document.querySelector('button:disabled')?.textContent?.includes('Copying'));
        if (mode === 'success') {
          await page.waitForFunction(() => window.__copiedQuery !== null);
          assert.equal(await page.evaluate(() => window.__copiedQuery), query);
          assert.match(await feedback.textContent(), locale === 'th' ? /คัดลอกแล้ว/ : /Copied\./);
        } else {
          const fallback = page.getByRole('textbox', { name: locale === 'th' ? 'คำค้นสำหรับคัดลอก' : 'Search text to copy' });
          await fallback.waitFor();
          assert.equal(await fallback.inputValue(), query);
          await fallback.focus();
          assert.equal(await fallback.evaluate(el => el.selectionEnd - el.selectionStart), query.length);
          assert.match(await feedback.textContent(), locale === 'th' ? /คัดลอกอัตโนมัติไม่ได้/ : /Could not copy/);
        }
        assert.equal(await feedback.getAttribute('role'), 'status');
        assert.equal(await feedback.getAttribute('aria-live'), 'polite');
        const panel = button.locator('xpath=../../..');
        const line = panel.getByRole('link', { name: locale === 'th' ? 'ให้ทีมช่วยค้นหาทาง LINE' : 'Ask our team to search on LINE', exact: true });
        assert.equal(await line.getAttribute('href'), 'https://lin.ee/PsQGAuu');
        assert.equal(await page.locator('#missing-product-request').count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No horizontal overflow');
        const box = await button.boundingBox();
        assert.ok(box.height >= 44, 'Touch target');
        await panel.screenshot({ path: `${output}/${locale}-${width}-${mode}.png` });
        results.push({ locale, width, mode, passed: true });
      }
      // Client navigation clears old feedback and copies the newly searched text.
      const changed = 'ZZNOTFOUND  ใหม่ /22 + & # %';
      const search = page.getByRole('textbox', { name: locale === 'th' ? 'ค้นหาสินค้า' : 'Search products', exact: true }).first();
      await search.fill(changed);
      await search.press('Enter');
      await page.waitForURL(url => url.searchParams.get('q') === changed);
      await page.getByRole('button', { name: label, exact: true }).waitFor();
      assert.equal(await page.getByRole('textbox', { name: locale === 'th' ? 'คำค้นสำหรับคัดลอก' : 'Search text to copy' }).count(), 0);
      await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async value => { window.__copiedQuery = value; } } }));
      await page.getByRole('button', { name: label, exact: true }).click();
      assert.equal(await page.evaluate(() => window.__copiedQuery), changed);
      await page.goto(`${base}/${locale}/products?q=P828889`, { waitUntil: 'networkidle' });
      assert.equal(await page.getByRole('button', { name: label, exact: true }).count(), 0);
      assert.ok((await page.locator('body').innerText()).includes('P828889'));
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  await fs.writeFile(`${output}/results.json`, JSON.stringify({ base, results, notes: 'Clipboard outcomes mocked; no customer messages or submissions. Navigation reset and exact-match regression passed.' }, null, 2));
  console.log(`PASS ${results.length} TH/EN desktop/mobile clipboard cases plus navigation and exact-match checks`);
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  if (app) await app.close();
}
