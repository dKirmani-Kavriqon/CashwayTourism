// Builds responsive AVIF and WebP variants and blur placeholders from raw/.
// The site serves no JPEG photos: AVIF where the browser supports it, WebP otherwise.
// The only JPEGs written are the social share cards (og-*.jpg), because some
// chat apps still don't show WebP link previews.
// Usage: npm run images
import sharp from 'sharp';
import { readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const RAW = 'raw';
const OUT = 'public/img';
const WIDTHS = [480, 760, 1200];
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await rm('public/og', { recursive: true, force: true });
await mkdir('public/og', { recursive: true });

// Destination hero photos also get a share card for their page's link preview.
const { DESTINATIONS } = await import('../src/data/content.js');
const SHARE = new Set(DESTINATIONS.map((d) => d.image));

const manifest = {};
for (const file of (await readdir(RAW)).sort()) {
  if (!/\.(jpe?g|png)$/i.test(file) || file.startsWith('logo')) continue;
  const name = path.parse(file).name;
  const img = sharp(path.join(RAW, file)).rotate();
  const { width, height } = await img.metadata();
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
  for (const w of widths) {
    const r = img.clone().resize({ width: w });
    await r.clone().avif({ quality: 55 }).toFile(`${OUT}/${name}-${w}.avif`);
    await r.clone().webp({ quality: 78 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  const lqip = await img.clone().resize({ width: 16 }).blur(1).webp({ quality: 50 }).toBuffer();
  const { dominant } = await img.clone().stats();
  // 1200x630 share card for link previews.
  if (SHARE.has(name)) await img.clone().resize(1200, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 80, mozjpeg: true }).toFile(`public/og/${name}.jpg`);
  manifest[name] = {
    w: width, h: height, widths,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
    tone: `rgb(${dominant.r},${dominant.g},${dominant.b})`,
  };
}
await writeFile('src/data/images.json', JSON.stringify(manifest, null, 2));

// Logo: circular crop with transparent corners.
const size = 256;
const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}"/></svg>`);
const logoBuf = await sharp(`${RAW}/logo-crop.png`).resize(size, size).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
const logo = sharp(logoBuf);
await logo.clone().toFile('public/logo-256.png');
await logo.clone().resize(96, 96).toFile('public/logo-96.png');
await logo.clone().resize(180, 180).flatten({ background: '#f2f0ee' }).toFile('public/apple-touch-icon.png');
await logo.clone().resize(32, 32).toFile('public/favicon-32.png');
// Open Graph card
await sharp(`${RAW}/dal-autumn.jpg`).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile('public/og-kashway.jpg');
console.log('images:', Object.keys(manifest).join(', '));
