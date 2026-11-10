import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MAP_POINTS, MAP_CATEGORIES, DEST_BY_SLUG, PHOTOS } from '../data/content.js';

const BASE = import.meta.env.BASE_URL;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
import { TILE_URL, TILE_ATTRIBUTION } from '../config.js';
import IMAGES from '../data/images.json';
import { ZoomPhoto } from './PhotoViewer.jsx';
import Topo from './Topo.jsx';
import { Arrow, Pin, Close } from './Icons.jsx';
import { EASE } from '../lib/motion.jsx';

/**
 * Interactive Leaflet map with category filters, a keyboard-friendly place
 * list, preview cards and Google Maps directions. Leaflet loads on demand.
 */
export default function MapView({ focus, points = MAP_POINTS, height = '78vh' }) {
  const el = useRef(null);
  const map = useRef(null);
  const markers = useRef({});
  const [L, setL] = useState(null);
  const [failed, setFailed] = useState(false);
  const [cat, setCat] = useState('all');
  const [sel, setSel] = useState(null);

  const visible = useMemo(() => points.filter((p) => cat === 'all' || p.cat === cat), [points, cat]);

  // Load Leaflet only when the map is near the viewport.
  useEffect(() => {
    let cancelled = false;
    const io = new IntersectionObserver(async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      try {
        const [mod] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
        if (!cancelled) setL(mod.default || mod);
      } catch { if (!cancelled) setFailed(true); }
    }, { rootMargin: '400px' });
    if (el.current) io.observe(el.current);
    return () => { cancelled = true; io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!L || !el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true });
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 18 }).addTo(m);
    // Wheel zoom only after the map is clicked, so the page keeps scrolling.
    m.on('click focus', () => m.scrollWheelZoom.enable());
    m.on('mouseout blur', () => m.scrollWheelZoom.disable());
    map.current = m;
    return () => { m.remove(); map.current = null; markers.current = {}; };
  }, [L]);

  // Sync markers with the filter.
  useEffect(() => {
    const m = map.current;
    if (!L || !m) return;
    Object.values(markers.current).forEach((mk) => mk.remove());
    markers.current = {};
    visible.forEach((p) => {
      // Hovering or focusing a marker shows a small photo preview above it.
      const thumb = p.image && IMAGES[p.image]
        ? `<em class="mk__pop" aria-hidden="true"><img src="${BASE}img/${p.image}-thumb.webp" alt="" width="200" height="200" loading="lazy" decoding="async"><span>${esc(p.name)}</span></em>`
        : '';
      const icon = L.divIcon({
        className: '',
        html: `<span class="mk mk--${p.cat}${thumb ? ' has-pop' : ''}${sel === p.id ? ' is-on' : ''}"><i></i><b>${esc(p.name)}</b>${thumb}</span>`,
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      const mk = L.marker(p.coords, { icon, title: p.name, alt: p.name, keyboard: true, riseOnHover: true })
        .on('click', () => setSel(p.id))
        .addTo(m);
      markers.current[p.id] = mk;
    });
  }, [L, visible, sel]);

  // Frame the visible places whenever the filter changes.
  useEffect(() => {
    const m = map.current;
    if (!L || !m) return;
    const target = focus ? visible.filter((p) => p.dest === focus) : visible;
    const pts = (target.length ? target : visible).map((p) => p.coords);
    if (pts.length === 1) m.setView(pts[0], 12);
    else if (pts.length) m.fitBounds(pts, { padding: [60, 60], maxZoom: focus ? 12 : 10 });
  }, [L, visible, focus]);

  const choose = (p) => {
    setSel(p.id);
    map.current?.flyTo(p.coords, Math.max(map.current.getZoom(), 12), { duration: 1.2 });
  };
  const current = points.find((p) => p.id === sel);
  // Every map photo, in list order, so the full-screen viewer can swipe between places.
  const album = useMemo(() => [...new Set(visible.map((p) => p.image).filter((n) => n && IMAGES[n]))], [visible]);
  const dest = current?.dest && DEST_BY_SLUG[current.dest];

  return (
    <div className="mapx" style={{ '--map-h': height }}>
      <div className="mapx__bar">
        <div className="chips" role="group" aria-label="Filter places on the map">
          <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => { setCat('all'); setSel(null); }}>All places</button>
          {Object.entries(MAP_CATEGORIES).map(([k, v]) => (
            <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => { setCat(k); setSel(null); }}>{v}</button>
          ))}
        </div>
      </div>
      <div className="mapx__body">
        <ul role="list" className="mapx__list" aria-label="Places">
          {visible.map((p) => (
            <li key={p.id}>
              <button type="button" className="mapx__item" aria-pressed={sel === p.id} onClick={() => choose(p)}>
                {p.image && IMAGES[p.image]
                  ? <img className="mapx__thumb" src={`${BASE}img/${p.image}-thumb.webp`} alt="" width="40" height="40" loading="lazy" decoding="async" />
                  : <span className={`dot dot--${p.cat}`} aria-hidden="true" />}
                <span>{p.name}</span>
                <span className="mapx__cat">{MAP_CATEGORIES[p.cat]}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mapx__map">
          <div ref={el} className="mapx__canvas" role="region" aria-label="Map of Kashmir destinations. Click the map to enable scroll zoom." />
          {!L && (
            <div className="mapx__loading" aria-live="polite">
              {failed ? 'The map could not load. Check your connection and refresh the page.' : 'Loading the map…'}
            </div>
          )}
          <AnimatePresence>
            {current && (
              <motion.article key={current.id} className="mapx__card"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, ease: EASE }}>
                <button type="button" className="icon-btn mapx__close" onClick={() => setSel(null)} aria-label="Close preview"><Close size={16} /></button>
                <div className="mapx__media">
                  {current.image && IMAGES[current.image]
                    ? <ZoomPhoto name={current.image} group={album} sizes="(max-width: 760px) 40vw, 180px" label={`Enlarge photo: ${PHOTOS[current.image]?.caption || current.name}`} />
                    : <Topo seed={current.id} accent={dest?.accent} rings={10} />}
                </div>
                <div className="mapx__info">
                  <span className="eyebrow eyebrow--plain">{MAP_CATEGORIES[current.cat]}</span>
                  <h3>{current.name}</h3>
                  <p>{current.text}</p>
                  <div className="mapx__actions">
                    <a className="link-arrow" target="_blank" rel="noopener noreferrer"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${current.coords.join(',')}`}>
                      <Pin /> Directions
                    </a>
                    {dest && <Link className="link-arrow" to={`/destinations/${dest.slug}`}>{current.dest === current.id ? 'Explore' : `About ${dest.name}`} <Arrow /></Link>}
                  </div>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
