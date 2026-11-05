// Run from the checkout root. BASE_URL may point to an authorized Preview.
const { chromium } = require('playwright');
const fs = require('node:fs');
const base = process.env.BASE_URL || 'http://localhost:3100';
const dir = 'docs/qa/pr179/fidelity';
(async () => {
  const browser = await chromium.launch();
  const results = { base, captures: [], checks: [] };
  for (const [width, lang] of [[1440,'th'],[1440,'en'],[1024,'th'],[390,'th'],[390,'en'],[360,'th'],[430,'th']]) {
    const page = await browser.newPage({ locale: lang === 'en' ? 'en-US' : 'th-TH', viewport: { width, height: width < 768 ? 844 : 1000 } });
    // Keep browser QA from sending analytics or customer submissions.
    await page.route('**/api/**', route => route.request().method() === 'POST' ? route.abort() : route.continue());
    await page.goto(`${base}/${lang}`);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${dir}/${width}-${lang}-consent.png` });
    await page.getByRole('button', { name: /Reject analytics|ปฏิเสธคุกกี้/ }).click();
    await page.screenshot({ path: `${dir}/${width}-${lang}-first.png` });
    await page.screenshot({ path: `${dir}/${width}-${lang}-full.png`, fullPage: true });
    results.captures.push(await page.evaluate(() => ({
      url: location.href, width: innerWidth, pageHeight: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      heading: document.querySelector('h1').innerText,
      image: document.querySelector('picture img').currentSrc,
      line: [...document.querySelectorAll('a[href*="lin.ee"]')].map(a => a.href),
      searchTop: document.querySelector('input[name=q]').getBoundingClientRect().top,
      lineTop: document.querySelector('a[href*="lin.ee"][class*="lineButton"]').getBoundingClientRect().top,
      font: getComputedStyle(document.querySelector('h1')).fontFamily,
    })));
    if ((width === 390 || width === 1440) && lang === 'th') {
      const input = page.locator('input[name=q]').first();
      await input.click(); await input.fill('P181');
      await page.getByRole('button', { name: /ดูผลลัพธ์ทั้งหมด/ }).waitFor();
      const viewAll = page.getByRole('button', { name: /ดูผลลัพธ์ทั้งหมด/ });
      const clickable = await viewAll.evaluate(el => {
        const r = el.getBoundingClientRect();
        return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
      });
      await page.screenshot({ path: `${dir}/${width}-suggestions.png`, fullPage: true });
      await input.press('ArrowDown'); await input.press('Escape');
      results.checks.push({ width, viewAllClickable: clickable, escapeFocus: await input.evaluate(el => document.activeElement === el) });
      // A fresh focus avoids the pre-existing post-Escape draft sync behavior.
      await page.locator('h1').click(); await input.click(); await input.fill('P181'); await input.press('Enter');
      await page.waitForURL('**/products?q=P181');
      results.checks.push({ width, searchUrl: page.url() });
      await page.goto(`${base}/th`); await page.waitForTimeout(700); await page.locator('h1').click();
      await page.getByRole('button', { name: 'P551864', exact: true }).click();
      await page.waitForURL('**/products?q=P551864');
      results.checks.push({ width, exampleUrl: page.url() });
      await page.goto(`${base}/th/quote`);
      results.checks.push({ width, rfqLoads: await page.locator('h1').isVisible(), submitted: false });
      if (width === 390) {
        await page.goto(`${base}/th`); await page.waitForTimeout(700);
        await page.locator('header summary').click();
        results.checks.push({ width, mobileMenuOpen: await page.locator('header details').getAttribute('open') !== null });
        await page.screenshot({ path: `${dir}/390-menu.png` });
      }
    }
    await page.close();
  }
  const page = await browser.newPage({ locale: 'th-TH' });
  await page.goto(`${base}/th`); await page.locator('header a[href="/en"]').click();
  await page.waitForURL('**/en');
  results.checks.push({ languageSwitch: page.url() });
  for (const path of ['/th/articles/industrial-filter-selection-guide','/th/articles/when-to-replace-engine-air-filter','/th/cross-reference/P828889']) {
    const response = await page.goto(base + path);
    results.checks.push({ path, status: response.status() });
  }
  fs.writeFileSync(`${dir}/results.json`, JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
