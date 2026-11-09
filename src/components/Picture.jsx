import { useEffect, useRef, useState } from 'react';
import IMAGES from '../data/images.json';
import { PHOTOS } from '../data/content.js';

const BASE = import.meta.env.BASE_URL;

/** URL of one variant, e.g. img('dal-autumn', 480, 'avif'). */
export const imgUrl = (name, w, ext) => `${BASE}img/${IMAGES[name].file}-${w}.${ext}`;

// One shared observer starts loading photos about a screen and a half before they scroll
// into view. Native lazy loading waits much longer on some browsers (Safari especially),
// which is what made photos appear late while scrolling. Photos inside a sideways
// carousel (marked data-carousel) start together when the carousel comes near, because
// a carousel hides its off-screen cards from the observer.
let observer = null;
const waiting = new Map();
function watch(el, cb) {
  if (typeof IntersectionObserver === 'undefined') { cb(); return () => {}; }
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const fn = waiting.get(e.target);
        waiting.delete(e.target);
        observer.unobserve(e.target);
        fn?.();
      });
    }, { rootMargin: '150% 100%' });
  }
  const target = el.closest('[data-carousel]') || el;
  const prev = waiting.get(target);
  const run = prev ? () => { prev(); cb(); } : cb;
  waiting.set(target, run);
  observer.observe(target);
  return () => {
    if (waiting.get(target) === run) { waiting.delete(target); observer.unobserve(target); }
  };
}

/**
 * Starts downloading the largest variant of a photo in the background (used before the
 * photo viewer opens). The browser picks AVIF, WebP or JPEG exactly as it would on the page.
 */
const warmed = new Set();
export function warmPhoto(name) {
  const meta = IMAGES[name];
  if (!meta || warmed.has(name) || typeof document === 'undefined') return;
  warmed.add(name);
  const w = meta.widths[meta.widths.length - 1];
  const pic = document.createElement('picture');
  for (const ext of ['avif', 'webp']) {
    const s = document.createElement('source');
    s.type = `image/${ext}`;
    s.srcset = imgUrl(name, w, ext);
    pic.appendChild(s);
  }
  const img = document.createElement('img');
  img.decoding = 'async';
  pic.appendChild(img);
  img.src = imgUrl(name, w, 'jpg');
}

/** Responsive AVIF/WebP/JPEG picture with a blurred placeholder and a short fade-in. */
export default function Picture({
  name, sizes = '100vw', className = '', priority = false, alt, style, imgStyle, children, ratio,
}) {
  const meta = IMAGES[name];
  const [loaded, setLoaded] = useState(false);
  const [near, setNear] = useState(priority);
  const box = useRef(null);

  useEffect(() => {
    if (near || !box.current) return undefined;
    return watch(box.current, () => setNear(true));
  }, [near]);

  if (!meta) return null;
  const set = (ext) => meta.widths.map((w) => `${imgUrl(name, w, ext)} ${w}w`).join(', ');
  const largest = meta.widths[meta.widths.length - 1];
  return (
    <div
      ref={box}
      className={`pic ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ backgroundImage: `url(${meta.lqip})`, aspectRatio: ratio, ...style }}
    >
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
        <img
          src={imgUrl(name, largest, 'jpg')}
          srcSet={set('jpg')}
          sizes={sizes}
          width={meta.w}
          height={meta.h}
          alt={alt ?? PHOTOS[name]?.alt ?? ''}
          loading={near ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          ref={(el) => {
            // Already in the browser cache: show it at once, with no fade.
            if (el && el.complete && el.naturalWidth && !loaded) {
              el.style.transition = 'none';
              setLoaded(true);
            }
          }}
          style={imgStyle}
        />
      </picture>
      {children}
    </div>
  );
}
