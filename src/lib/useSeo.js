import { useEffect } from 'react';
import { seoFor } from '../data/seo.js';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

/**
 * Keeps the <head> in step with the page: title, description, canonical,
 * Open Graph and X cards, and the page's structured data. The same values
 * are written into each page's static HTML at build time (see src/data/seo.js).
 */
export default function useSeo(path) {
  useEffect(() => {
    const s = seoFor(path);
    document.title = s.title;
    setMeta('name', 'description', s.description);
    setMeta('name', 'robots', s.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setMeta('property', 'og:type', s.type);
    setMeta('property', 'og:url', s.url);
    setMeta('property', 'og:title', s.title);
    setMeta('property', 'og:description', s.description);
    setMeta('property', 'og:image', s.image);
    setMeta('property', 'og:image:secure_url', s.image);
    setMeta('property', 'og:image:alt', s.imageAlt);
    setMeta('name', 'twitter:title', s.title);
    setMeta('name', 'twitter:description', s.description);
    setMeta('name', 'twitter:image', s.image);
    setMeta('name', 'twitter:image:alt', s.imageAlt);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = s.url;
    document.head.querySelectorAll('script[data-page]').forEach((n) => n.remove());
    for (const o of s.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.page = '1';
      script.textContent = JSON.stringify(o);
      document.head.appendChild(script);
    }
  }, [path]);
}
