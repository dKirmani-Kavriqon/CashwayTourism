import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { DESTINATIONS } from './src/data/content.js';

const BASE = process.env.VITE_BASE || '/';
const HASH = process.env.VITE_ROUTER === 'hash';

/*
  The lead photo of the home page and of each destination page is what people see first,
  but the browser normally only finds it after the JavaScript has downloaded and run.
  This adds a tiny script to index.html that starts downloading the right lead photo for
  the address being opened straight away, alongside the JavaScript.
  The `sizes` values must match the ones the pages use, so the same file is picked.
*/
function preloadLeadPhoto() {
  return {
    name: 'kashway-preload-lead-photo',
    transformIndexHtml(html) {
      const images = JSON.parse(readFileSync('src/data/images.json', 'utf8'));
      const entry = (name, sizes) => {
        const m = images[name];
        return m && { srcset: m.widths.map((w) => `img/${m.file}-${w}.avif ${w}w`).join(', '), sizes };
      };
      const routes = { '/': [entry('dal-autumn', '(min-width: 900px) 34vw, 100vw'), entry('gulmarg-gondola', '(min-width: 900px) 18vw, 40vw')] };
      for (const d of DESTINATIONS) {
        if (d.image) routes[`/destinations/${d.slug}`] = [entry(d.image, '(min-width: 900px) 45vw, 100vw')];
      }
      const script = `(function(){try{
var R=${JSON.stringify(routes)},b=${JSON.stringify(BASE)};
var p=${HASH ? "(location.hash.replace(/^#/,'')||'/')" : "('/'+location.pathname.slice(b.length)).replace(/\\/\\/+/g,'/')"};
p=p.split('?')[0].replace(/(.)\\/$/,'$1');(R[p]||[]).forEach(function(e,i){if(!e)return;
var l=document.createElement('link');l.rel='preload';l.as='image';l.type='image/avif';
l.setAttribute('imagesrcset',e.srcset.replace(/(^|, )img\\//g,'$1'+b+'img/'));l.setAttribute('imagesizes',e.sizes);
if(!i)l.setAttribute('fetchpriority','high');document.head.appendChild(l);});}catch(_){}})();`;
      // Right after the viewport tag: before it, phones would size the photo for a desktop
      // width; after the stylesheet, the script would wait for the CSS to download first.
      return html.replace(/<meta name="viewport"[^>]*>/, (tag) => `${tag}\n    <script>${script}</script>`);
    },
  };
}

// VITE_ROUTER=hash builds a copy that runs from any static file host
// (used for previews). Production uses clean URLs with a SPA fallback.
export default defineConfig({
  plugins: [react(), preloadLeadPhoto()],
  base: BASE,
  build: { target: 'es2020', cssCodeSplit: true, chunkSizeWarningLimit: 600 },
});
