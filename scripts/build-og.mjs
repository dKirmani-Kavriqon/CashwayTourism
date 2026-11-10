// Draws the 1200×630 link-preview card for every page into public/og/,
// using the site's own fonts and photos. The cards are committed, so a
// normal build doesn't need this; run it after changing photos or page
// headlines in src/data/seo.js.
//
// Usage: npm run og   (needs Playwright with Chromium: npx playwright install chromium)
import { createRequire } from 'node:module';
import { mkdir, readFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { OG_CARDS, SITE } from '../src/data/seo.js';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  console.error('Playwright is needed to draw the share cards: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const OUT = 'public/og';
await mkdir(OUT, { recursive: true });
const font = (p) => pathToFileURL(path.resolve('node_modules', p)).href;
const SERIF = font('@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2');
const SERIF_I = font('@fontsource-variable/newsreader/files/newsreader-latin-opsz-italic.woff2');
const SANS = font('@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2');
const logo = `data:image/png;base64,${(await readFile('public/logo-256.png')).toString('base64')}`;

async function photoData(name) {
  // A 1400px-wide WebP of the original keeps the page light but sharp.
  const buf = await sharp(`raw/${name}.jpg`).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function page(card, photo) {
  const [first, ...rest] = card.headline || [];
  const host = SITE.url.replace(/^https?:\/\/(www\.)?/, '');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Newsreader'; src: url('${SERIF}') format('woff2'); font-weight: 200 800; }
  @font-face { font-family: 'Newsreader'; font-style: italic; src: url('${SERIF_I}') format('woff2'); font-weight: 200 800; }
  @font-face { font-family: 'Hanken'; src: url('${SANS}') format('woff2'); font-weight: 100 900; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #16201b; }
  .card { position: relative; width: 1200px; height: 630px; color: #f4f2ec; font-family: 'Hanken', sans-serif; }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 45%; }
  .shade { position: absolute; inset: 0; background:
      linear-gradient(90deg, rgba(10,15,12,0.88) 0%, rgba(10,15,12,0.62) 38%, rgba(10,15,12,0.08) 72%, rgba(10,15,12,0) 100%),
      linear-gradient(0deg, rgba(10,15,12,0.55) 0%, rgba(10,15,12,0) 40%); }
  .frame { position: absolute; inset: 28px; border: 1px solid rgba(220,196,150,0.35); border-radius: 28px; }
  .brand { position: absolute; left: 72px; top: 66px; display: flex; align-items: center; gap: 16px; }
  .brand img { width: 58px; height: 58px; border-radius: 50%; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
  .brand b { font-weight: 650; font-size: 21px; letter-spacing: 0.3em; text-transform: uppercase; }
  .brand span { display: block; font-size: 15px; letter-spacing: 0.04em; color: rgba(244,242,236,0.78); margin-top: 3px; }
  .copy { position: absolute; left: 72px; bottom: 74px; width: 720px; }
  .eyebrow { display: flex; align-items: center; gap: 14px; font-size: 17px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #dcc496; margin-bottom: 20px; }
  .eyebrow::before { content: ''; width: 34px; height: 1px; background: #dcc496; }
  h1 { font-family: 'Newsreader', serif; font-weight: 360; font-size: ${first && first.length + (rest[0] || '').length > 34 ? 66 : 84}px; line-height: 0.98; letter-spacing: -0.02em; font-variation-settings: 'opsz' 72; text-wrap: balance; }
  h1 em { display: block; font-style: italic; color: #f0a07e; }
  .foot { position: absolute; right: 72px; bottom: 74px; text-align: right; font-size: 16px; letter-spacing: 0.06em; color: rgba(244,242,236,0.85); }
  .foot strong { display: block; font-size: 22px; font-weight: 600; letter-spacing: 0.02em; color: #fff; margin-bottom: 4px; }
  </style></head><body><div class="card">
    <img class="photo" src="${photo}" alt="">
    <div class="shade"></div><div class="frame"></div>
    <div class="brand"><img src="${logo}" alt=""><div><b>KashWay</b><span>Tour &amp; Travels · Srinagar</span></div></div>
    <div class="copy">
      ${card.eyebrow ? `<p class="eyebrow">${esc(card.eyebrow)}</p>` : ''}
      <h1>${esc(first || '')}${rest.length ? `<em>${esc(rest.join(' '))}</em>` : ''}</h1>
    </div>
    <div class="foot"><strong>${esc(host)}</strong>${esc(SITE.recognition)}</div>
  </div></body></html>`;
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const tab = await ctx.newPage();
const seen = new Set();
for (const card of OG_CARDS) {
  if (seen.has(card.key)) continue;
  seen.add(card.key);
  await tab.setContent(page(card, await photoData(card.photo)), { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: 'png' });
  await sharp(png).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(`${OUT}/${card.key}.jpg`);
  console.log('og:', card.key);
}
await browser.close();
// The default card, kept at its old address for anything that still links to it.
await copyFile(`${OUT}/home.jpg`, 'public/og-kashway.jpg');
