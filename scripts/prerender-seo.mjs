// After `vite build`: gives every page its own static HTML with that page's
// title, description, Open Graph / X tags and structured data already in the
// <head>, so link previews (WhatsApp, Facebook, LinkedIn, X) and search
// engines see the right card without running JavaScript. The app itself is
// unchanged: each file loads the same bundle.
// Also writes 404.html (SPA fallback for static hosts) and sitemap.xml.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { SEO_ROUTES, headTags, seoFor, SITE } from '../src/data/seo.js';
import { PHOTOS, DESTINATIONS } from '../src/data/content.js';

const DIST = 'dist';
const IMAGES = JSON.parse(await readFile('src/data/images.json', 'utf8'));
const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
const BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!BLOCK.test(shell)) throw new Error('index.html is missing the <!--seo:start--> … <!--seo:end--> block');

const render = (route) => shell.replace(BLOCK, () => headTags(route));

for (const route of SEO_ROUTES) {
  const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, render(route));
}
await writeFile(path.join(DIST, '404.html'), render('/404'));

// Sitemap with each page's images (share card plus its photographs).
const photoUrl = (name) => `${SITE.url}/img/${name}-${IMAGES[name].widths.at(-1)}.webp`;
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const photosFor = (route) => {
  if (route === '/gallery') return Object.keys(PHOTOS).filter((n) => n !== 'teaser' && IMAGES[n]);
  const m = route.match(/^\/destinations\/(.+)$/);
  if (m) return Object.keys(PHOTOS).filter((n) => PHOTOS[n].place === m[1] && IMAGES[n]);
  if (route === '/destinations') return DESTINATIONS.map((d) => d.image).filter((n) => n && IMAGES[n]);
  return [];
};
const today = new Date().toISOString().slice(0, 10);
const urls = SEO_ROUTES.map((route) => {
  const s = seoFor(route);
  const imgs = [
    `      <image:image><image:loc>${xml(s.image)}</image:loc></image:image>`,
    ...photosFor(route).map((n) => `      <image:image><image:loc>${xml(photoUrl(n))}</image:loc></image:image>`),
  ];
  return `  <url>\n    <loc>${xml(s.url)}</loc>\n    <lastmod>${today}</lastmod>\n${imgs.join('\n')}\n  </url>`;
});
await writeFile(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`);

console.log(`seo: prerendered ${SEO_ROUTES.length} pages, 404.html and sitemap.xml`);
