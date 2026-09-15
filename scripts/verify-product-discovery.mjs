import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { load } from 'cheerio';

const base = 'http://127.0.0.1:3130';
const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3130'], { stdio: ['ignore', 'pipe', 'pipe'] });
server.stderr.on('data', d => process.stderr.write(d));
try {
  for (let i = 0; i < 40; i++) {
    try { await fetch(base + '/th/products'); break; }
    catch (error) { if (i === 39) throw error; await new Promise(r => setTimeout(r, 500)); }
  }
  for (const locale of ['th', 'en']) {
    const response = await fetch(`${base}/${locale}/products`);
    assert.equal(response.status, 200);
    const $ = load(await response.text());
    const links = $('nav[aria-labelledby="product-discovery-title"] a');
    assert.equal(links.length, 10);
    for (const link of links.toArray()) {
      const href = $(link).attr('href');
      const result = await fetch(base + href);
      assert.equal(result.status, 200, href);
      const page = load(await result.text());
      assert(page('title').text().includes($(link).find('span').last().text()), href);
      assert.equal(page('link[rel=canonical]').attr('href'), 'https://www.mrtsupplier.com' + href);
      assert(!page('meta[name=robots]').attr('content')?.includes('noindex'));
    }
    for (const query of ['?q=P552050', '?request=1']) {
      const result = await fetch(`${base}/${locale}/products${query}`);
      assert.equal(result.status, 200);
      const page = load(await result.text());
      assert.equal(page('#product-discovery-title').length, 0);
      if (query.includes('q=')) assert(page('body').text().includes('P552050'));
    }
    console.log(`${locale}: 10 links, titles, canonical URLs, robots, search and request routes PASS`);
  }
  const legacy = await fetch(base + '/catalog', { redirect: 'manual' });
  assert([301, 302, 307, 308].includes(legacy.status));
  assert(legacy.headers.get('location')?.endsWith('/th/products'));
  console.log('Legacy catalog redirect PASS');
} finally {
  server.kill();
}
