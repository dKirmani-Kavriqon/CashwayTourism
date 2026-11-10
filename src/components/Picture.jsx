import { useState } from 'react';
import IMAGES from '../data/images.json';
import { PHOTOS } from '../data/content.js';

const BASE = import.meta.env.BASE_URL;

/** Responsive AVIF/WebP picture with a blurred placeholder and fade-in. */
export default function Picture({
  name, sizes = '100vw', className = '', priority = false, alt, style, imgStyle, children, ratio,
}) {
  const meta = IMAGES[name];
  const [loaded, setLoaded] = useState(false);
  if (!meta) return null;
  const set = (ext) => meta.widths.map((w) => `${BASE}img/${name}-${w}.${ext} ${w}w`).join(', ');
  const largest = meta.widths[meta.widths.length - 1];
  return (
    <div
      className={`pic ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ backgroundImage: `url(${meta.lqip})`, aspectRatio: ratio, ...style }}
    >
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
        <img
          src={`${BASE}img/${name}-${largest}.webp`}
          srcSet={set('webp')}
          sizes={sizes}
          width={meta.w}
          height={meta.h}
          alt={alt ?? PHOTOS[name]?.alt ?? ''}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          onLoad={() => setLoaded(true)}
          ref={(el) => { if (el && el.complete && el.naturalWidth && !loaded) setLoaded(true); }}
          style={imgStyle}
        />
      </picture>
      {children}
    </div>
  );
}
