import { useEffect } from 'react';
import { BRAND } from '../config.js';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

/** Per-page title, description, canonical, Open Graph and optional JSON-LD. */
export default function useSeo({ title, description, path = '/', image = '/og-kashway.jpg', jsonLd }) {
  useEffect(() => {
    const full = title ? `${title} · KashWay` : `${BRAND.legalName} · ${BRAND.tagline}`;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', BRAND.url + path);
    setMeta('property', 'og:image', BRAND.url + image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = BRAND.url + path;
    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.page = '1';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => { if (script) script.remove(); };
  }, [title, description, path, image, jsonLd && JSON.stringify(jsonLd)]);
}
