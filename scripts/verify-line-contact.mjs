import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:3103';
if (!['localhost','127.0.0.1'].includes(new URL(base).hostname) && !new URL(base).hostname.endsWith('.vercel.app')) throw new Error('Use local or Preview only');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const output = process.env.QA_OUTPUT || '/tmp/mrt-line-contact';
await fs.mkdir(output, { recursive: true });
const results = [];
try {
  for (const locale of ['th', 'en']) for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 950 } });
    if (process.env.PREVIEW_ACCESS_URL) {
      const auth = await context.newPage();
      await auth.goto(process.env.PREVIEW_ACCESS_URL);
      await auth.close();
    }
    await context.addInitScript(() => localStorage.setItem('mrt_cookie_consent', 'rejected'));
    let externalAttempts = 0;
    await context.route('**/*', route => {
      const request = route.request();
      if (new URL(request.url()).origin !== new URL(base).origin) {
        if (request.url().startsWith('https://lin.ee/')) externalAttempts++;
        return route.abort();
      }
      return ['GET', 'HEAD'].includes(request.method()) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    for (const path of ['', '/contact', '/products?q=ZZZXQ999999999', '/products/P828889']) {
      await page.goto(`${base}/${locale}${path}`, { waitUntil: 'networkidle' });
      // Header mobile menu is otherwise collapsed.
      if (width < 1024) await page.locator('header details summary').click();
      const triggers = page.locator('[data-line-contact="trigger"]');
      let checked = 0;
      for (const trigger of await triggers.all()) {
        if (!await trigger.isVisible()) continue;
        assert.equal(await trigger.getAttribute('href'), 'https://lin.ee/PsQGAuu');
        for (let repeat = 0; repeat < 3; repeat++) {
          const before = externalAttempts;
          await trigger.click();
          const panel = page.getByRole('dialog');
          await panel.waitFor();
          assert.ok(await panel.getByText('@mrtsupplier', { exact: true }).isVisible());
          assert.equal(await panel.getByRole('img').getAttribute('src'), '/line-oa-search-qr.svg');
          assert.ok(await panel.getByRole('img').evaluate(el => el.complete && el.naturalWidth > 0));
          assert.equal(await panel.getByRole('link').getAttribute('href'), 'https://lin.ee/PsQGAuu');
          if (width >= 768) assert.equal(externalAttempts, before, 'Desktop only opens local help');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
          if (repeat === 0 && checked === 0) await page.screenshot({ path: `${output}/${locale}-${width}-${path.replace(/[^a-zA-Z0-9]/g, '_') || 'home'}.png` });
          if (repeat % 2) await panel.getByRole('button', { name: locale === 'th' ? 'ปิด' : 'Close', exact: true }).click();
          else await page.keyboard.press('Escape');
          await panel.waitFor({ state: 'hidden' });
          assert.notEqual(await page.locator('body').evaluate(el => el.style.overflow), 'hidden');
        }
        checked++;
      }
      assert.ok(checked > 0);
      results.push({ locale, width, path, checked });
    }
    // Navigate away while open, then Back: the previous panel must not reopen.
    await page.locator('[data-line-contact="trigger"]').filter({ visible: true }).first().click();
    await page.goto(`${base}/${locale}/contact`);
    await page.goBack();
    assert.equal(await page.getByRole('dialog').count(), 0);
    await context.close();
  }
  await fs.writeFile(`${output}/results.json`, JSON.stringify({ base, results, note: 'Simulated viewports; mobile external navigation blocked. Not a real phone test.' }, null, 2));
  console.log(`PASS ${results.length} page/locale/viewport cases`);
} finally { await browser.close(); }
