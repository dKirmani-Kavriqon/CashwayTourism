// Builds responsive AVIF/WebP/JPEG variants and blur placeholders from raw/.
// Usage: npm run images
import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const RAW = 'raw';
const OUT = 'public/img';
const WIDTHS = [480, 760];
await mkdir(OUT, { recursive: true });

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
    await r.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${name}-${w}.jpg`);
  }
  const lqip = await img.clone().resize({ width: 16 }).blur(1).jpeg({ quality: 50 }).toBuffer();
  const { dominant } = await img.clone().stats();
  manifest[name] = {
    w: width, h: height, widths,
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
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
