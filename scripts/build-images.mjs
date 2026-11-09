// Builds responsive AVIF/WebP/JPEG variants and blur placeholders from raw/.
// Usage: npm run images
//
// File names carry a short content hash (dal-autumn.3f2a9c1e-480.avif), so hosts can
// cache them forever: a replaced photo gets a new name instead of a stale cached copy.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const RAW = 'raw';
const OUT = 'public/img';
const WIDTHS = [480, 760];
// Encoder settings (unchanged from the first release, so photo quality is identical).
// Tested: the slowest AVIF effort with 4:2:0 chroma saved only about 6% on these photos
// for an 8-minute build, so it isn't used.
const AVIF = { quality: 55 };
const WEBP = { quality: 78 };
const JPEG = { quality: 80, mozjpeg: true };
const SETTINGS = JSON.stringify({ WIDTHS, AVIF, WEBP, JPEG });

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const manifest = {};
for (const file of (await readdir(RAW)).sort()) {
  if (!/\.(jpe?g|png)$/i.test(file) || file.startsWith('logo')) continue;
  const name = path.parse(file).name;
  const bytes = await readFile(path.join(RAW, file));
  const hash = createHash('sha256').update(bytes).update(SETTINGS).digest('hex').slice(0, 8);
  const stem = `${name}.${hash}`;
  const img = sharp(bytes).rotate();
  const { width, height } = await img.metadata();
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))];
  await Promise.all(widths.map(async (w) => {
    const r = img.clone().resize({ width: w });
    await Promise.all([
      r.clone().avif(AVIF).toFile(`${OUT}/${stem}-${w}.avif`),
      r.clone().webp(WEBP).toFile(`${OUT}/${stem}-${w}.webp`),
      r.clone().jpeg(JPEG).toFile(`${OUT}/${stem}-${w}.jpg`),
    ]);
  }));
  const lqip = await img.clone().resize({ width: 16 }).blur(1).jpeg({ quality: 50 }).toBuffer();
  const { dominant } = await img.clone().stats();
  manifest[name] = {
    file: stem, w: width, h: height, widths,
    lqip: `data:image/jpeg;base64,${lqip.toString('base64')}`,
    tone: `rgb(${dominant.r},${dominant.g},${dominant.b})`,
  };
  console.log('  ', stem);
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
