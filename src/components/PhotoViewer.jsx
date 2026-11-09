import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import IMAGES from '../data/images.json';
import { PHOTOS } from '../data/content.js';
import Picture from './Picture.jsx';
import { Arrow, Close, ZoomIn, ZoomOut } from './Icons.jsx';

/*
  Full-screen photo viewer, modelled on how Photos behaves on iPhone:
  - the photo grows out of the thumbnail you tapped, and shrinks back into it on close
  - pinch, double-tap (touch), click (mouse), scroll wheel or trackpad pinch to zoom
  - drag to pan while zoomed; swipe sideways for the next photo, swipe down to close
  - every gesture has a visible button or key as well (Zoom, arrows, Close, Esc, + / - / 0)
*/

const BASE = import.meta.env.BASE_URL;
const MAX = 4;
const DOUBLE = 2.5;
const SRC_RADIUS = 22;

const Ctx = createContext({ open: () => {} });
export const useViewer = () => useContext(Ctx);

export function ViewerProvider({ children }) {
  const [state, setState] = useState(null);
  const open = useCallback((items, index = 0, source = null) => {
    const i = Math.max(0, index);
    setState({ items, index: i, start: i, source });
  }, []);
  const close = useCallback(() => setState(null), []);
  const setIndex = useCallback((i) => setState((s) => (s ? { ...s, index: i } : s)), []);
  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state && <Viewer key="photo-viewer" {...state} onIndex={setIndex} onClose={close} />}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

/** A photo that opens in the viewer when tapped. `group` is the list of photos to page through. */
export function ZoomPhoto({ name, group, sizes, priority, className = '', label, children }) {
  const { open } = useViewer();
  const list = group?.length ? group : [name];
  const caption = PHOTOS[name]?.caption;
  return (
    <button type="button" className={`zoomable ${className}`} aria-haspopup="dialog"
      aria-label={label || `Enlarge photo${caption ? `: ${caption}` : ''}`}
      onClick={(e) => open(list, list.indexOf(name), e.currentTarget)}>
      <Picture name={name} sizes={sizes} priority={priority} alt="" />
      <span className="zoomable__hint" aria-hidden="true"><ZoomIn size={16} /></span>
      {children}
    </button>
  );
}

// Where the photo sits on screen when it isn't zoomed: as large as fits between the bars,
// never more than a little past its real pixel size.
function layout(meta) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const compact = W < 720;
  const top = compact ? 64 : 76;
  const bottom = compact ? 132 : 112;
  const availW = W - (compact ? 0 : 192);
  const availH = Math.max(160, H - top - bottom);
  const ar = meta.w / meta.h;
  const w = Math.min(availW, availH * ar, meta.w * 1.35);
  const h = w / ar;
  return { W, H, w, h, cx: W / 2, cy: top + availH / 2 };
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function Viewer({ items, index, start, source, onIndex, onClose }) {
  const reduce = useReducedMotion();
  const name = items[index];
  const meta = IMAGES[name];
  const n = items.length;
  const [box, setBox] = useState(() => layout(meta));
  const [zoomed, setZoomed] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dir, setDir] = useState(0);
  const [hint, setHint] = useState(true);
  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  const root = useRef(null);
  const stage = useRef(null);
  const layer = useRef(null);
  const bg = useRef(null);
  const closeBtn = useRef(null);
  const z = useRef({ s: 1, x: 0, y: 0 });
  const ptrs = useRef(new Map());
  const g = useRef(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });
  const tapTimer = useRef(0);
  const boxRef = useRef(box);
  boxRef.current = box;

  // ---- transform helpers ------------------------------------------------
  const paint = useCallback((s, x, y, anim) => {
    z.current = { s, x, y };
    const el = layer.current;
    if (!el) return;
    el.style.transition = anim && !reduce ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
    setZoomed(s > 1.01);
  }, [reduce]);

  const clampT = (s, x, y, rubber = false) => {
    const { W, H, w, h, cx, cy } = boxRef.current;
    const lim = (v, lo, hi) => {
      if (v < lo) return rubber ? lo - (lo - v) * 0.3 : lo;
      if (v > hi) return rubber ? hi + (v - hi) * 0.3 : hi;
      return v;
    };
    const hw = (w * s) / 2;
    const hh = (h * s) / 2;
    const nx = hw > W / 2 ? lim(x, W - hw - cx, hw - cx) : lim(x, 0, 0);
    const ny = hh > H / 2 ? lim(y, H - hh - cy, hh - cy) : lim(y, 0, 0);
    return [nx, ny];
  };

  const zoomAt = useCallback((s2, px, py, anim) => {
    const { s, x, y } = z.current;
    const { cx, cy } = boxRef.current;
    const ns = Math.min(MAX, Math.max(1, s2));
    const lx = (px - cx - x) / s;
    const ly = (py - cy - y) / s;
    const [nx, ny] = clampT(ns, px - cx - lx * ns, py - cy - ly * ns);
    paint(ns, nx, ny, anim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paint]);

  const reset = useCallback((anim = true) => paint(1, 0, 0, anim), [paint]);

  const toggleAt = (px, py) => {
    if (z.current.s > 1.01) reset(true);
    else zoomAt(DOUBLE, px, py, true);
  };

  const setBg = (o, anim) => {
    if (!bg.current) return;
    bg.current.style.transition = anim ? 'opacity 0.35s' : 'none';
    bg.current.style.opacity = String(o);
  };

  // ---- navigation & closing --------------------------------------------
  const go = useCallback((d) => {
    if (n < 2) return;
    setDir(d);
    paint(1, 0, 0, false);
    onIndex((index + d + n) % n);
  }, [index, n, onIndex, paint]);

  const close = useCallback(() => {
    clearTimeout(tapTimer.current);
    setClosing(true);
    paint(1, 0, 0, false);
    requestAnimationFrame(() => onClose());
  }, [onClose, paint]);

  // ---- effects ----------------------------------------------------------
  useLayoutEffect(() => { setBox(layout(meta)); }, [meta]);

  useEffect(() => {
    const onResize = () => { setBox(layout(meta)); paint(1, 0, 0, false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [meta, paint]);

  useEffect(() => {
    const prevFocus = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus({ preventScroll: true });
    const t = setTimeout(() => setHint(false), 3200);
    return () => {
      html.style.overflow = prev;
      clearTimeout(t);
      clearTimeout(tapTimer.current);
      const back = source?.isConnected ? source : prevFocus;
      back?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === '+' || e.key === '=') zoomAt(z.current.s * 1.5, boxRef.current.cx + z.current.x, boxRef.current.cy + z.current.y, true);
      else if (e.key === '-' || e.key === '_') zoomAt(z.current.s / 1.5, boxRef.current.cx + z.current.x, boxRef.current.cy + z.current.y, true);
      else if (e.key === '0') reset(true);
      else if (e.key === 'Tab') {
        // keep focus inside the viewer
        const f = [...root.current.querySelectorAll('button:not([disabled])')].filter((b) => b.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go, zoomAt, reset]);

  // Wheel and trackpad pinch (needs a non-passive listener to stop the page zooming).
  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      const k = Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0018));
      zoomAt(z.current.s * k, e.clientX, e.clientY, false);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  // ---- pointer gestures -------------------------------------------------
  const insidePhoto = (px, py) => {
    const { w, h, cx, cy } = boxRef.current;
    const { s, x, y } = z.current;
    return Math.abs(px - cx - x) <= (w * s) / 2 && Math.abs(py - cy - y) <= (h * s) / 2;
  };

  const startPan = (p, pointerType) => {
    g.current = { type: 'pan', x0: p.x, y0: p.y, t0: { ...z.current }, moved: false, axis: null, pointerType, time: performance.now() };
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('button')) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const p = { x: e.clientX, y: e.clientY };
    ptrs.current.set(e.pointerId, p);
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      g.current = { type: 'pinch', d0: dist(a, b) || 1, m0: mid(a, b), t0: { ...z.current } };
      clearTimeout(tapTimer.current);
    } else if (ptrs.current.size === 1) {
      startPan(p, e.pointerType);
    }
  };

  const onPointerMove = (e) => {
    if (!ptrs.current.has(e.pointerId)) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const G = g.current;
    if (!G) return;
    const { cx, cy } = boxRef.current;
    if (G.type === 'pinch' && ptrs.current.size >= 2) {
      const [a, b] = [...ptrs.current.values()];
      let s = G.t0.s * (dist(a, b) / G.d0);
      if (s < 1) s = 1 - (1 - s) * 0.4;           // soft resistance below fit
      if (s > MAX) s = MAX + (s - MAX) * 0.25;    // and above the maximum
      const m = mid(a, b);
      const x = m.x - cx - ((G.m0.x - cx - G.t0.x) * s) / G.t0.s;
      const y = m.y - cy - ((G.m0.y - cy - G.t0.y) * s) / G.t0.s;
      paint(s, x, y, false);
      return;
    }
    if (G.type !== 'pan') return;
    const dx = e.clientX - G.x0;
    const dy = e.clientY - G.y0;
    if (!G.moved && Math.hypot(dx, dy) > 6) G.moved = true;
    if (!G.moved) return;
    if (G.t0.s > 1.01) {
      const [x, y] = clampT(G.t0.s, G.t0.x + dx, G.t0.y + dy, true);
      paint(G.t0.s, x, y, false);
      return;
    }
    if (!G.axis) G.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (G.axis === 'x') {
      paint(1, n > 1 ? dx : dx * 0.25, 0, false);
    } else {
      const y = dy > 0 ? dy : dy * 0.2;
      paint(1, 0, y, false);
      setBg(1 - Math.min(Math.max(dy, 0) / 420, 0.65), false);
    }
  };

  const settle = () => {
    const { s, x, y } = z.current;
    if (s <= 1.01) { reset(true); return; }
    const ns = Math.min(MAX, s);
    const [nx, ny] = clampT(ns, x, y);
    paint(ns, nx, ny, true);
  };

  const onTap = (e, pointerType) => {
    const px = e.clientX;
    const py = e.clientY;
    if (pointerType === 'mouse') {
      if (z.current.s > 1.01) reset(true);
      else if (insidePhoto(px, py)) zoomAt(DOUBLE, px, py, true);
      else close();
      return;
    }
    const now = performance.now();
    const L = lastTap.current;
    if (now - L.t < 320 && Math.hypot(px - L.x, py - L.y) < 40) {
      clearTimeout(tapTimer.current);
      lastTap.current = { t: 0, x: 0, y: 0 };
      toggleAt(px, py);
    } else {
      lastTap.current = { t: now, x: px, y: py };
      clearTimeout(tapTimer.current);
      tapTimer.current = setTimeout(() => setChrome((c) => !c), 320);
    }
  };

  const onPointerUp = (e) => {
    if (!ptrs.current.has(e.pointerId)) return;
    ptrs.current.delete(e.pointerId);
    const G = g.current;
    if (!G) return;
    if (G.type === 'pinch') {
      if (ptrs.current.size === 1) {
        const [p] = [...ptrs.current.values()];
        startPan(p, 'touch');
        g.current.moved = true;
      } else g.current = null;
      settle();
      return;
    }
    g.current = null;
    if (e.type === 'pointercancel') { settle(); setBg(1, true); return; }
    const dx = e.clientX - G.x0;
    const dy = e.clientY - G.y0;
    if (!G.moved) { onTap(e, G.pointerType); return; }
    if (G.t0.s > 1.01) { settle(); return; }
    const fast = performance.now() - G.time < 260;
    if (G.axis === 'x' && n > 1 && (Math.abs(dx) > 70 || (fast && Math.abs(dx) > 30))) { go(dx < 0 ? 1 : -1); return; }
    if (G.axis === 'y' && (dy > 120 || (fast && dy > 50))) { close(); return; }
    reset(true);
    setBg(1, true);
  };

  // ---- open/close choreography -----------------------------------------
  const { w, h, cx, cy } = box;
  const fromSource = () => {
    if (reduce || !source?.isConnected || index !== start) return null;
    const r = source.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const k = Math.max(r.width / w, r.height / h);
    const ix = Math.max(0, (w - r.width / k) / 2);
    const iy = Math.max(0, (h - r.height / k) / 2);
    const rad = SRC_RADIUS / k;
    return {
      x: r.left + r.width / 2 - cx,
      y: r.top + r.height / 2 - cy,
      scale: k,
      clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${rad}px)`,
    };
  };
  const src = fromSource();
  const shown = { x: 0, y: 0, scale: 1, opacity: 1, clipPath: 'inset(0px 0px 0px 0px round 0px)' };
  const hidden = src ? { ...src, opacity: 1 } : { x: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.96, opacity: 0, clipPath: shown.clipPath };
  const spring = reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };

  const caption = PHOTOS[name]?.caption;
  const set = (ext) => `${BASE}img/${name}-${meta.widths.at(-1)}.${ext}`;

  return (
    <motion.div ref={root} className={`pv ${chrome ? '' : 'is-bare'} ${zoomed ? 'is-zoomed' : ''}`}
      role="dialog" aria-modal="true" aria-label="Photo viewer"
      initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1, transition: { duration: 0.5 } }}>
      <motion.div ref={bg} className="pv__bg" aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.15 : 0.35 }} />

      <div ref={stage} className="pv__stage"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <motion.div className="pv__frame" data-open={opened && !closing ? '' : undefined}
          style={{ width: w, height: h, left: cx - w / 2, top: cy - h / 2 }}
          initial={hidden} animate={shown} exit={hidden} transition={spring}
          onAnimationComplete={() => { if (!closing) setOpened(true); }}>
          <div ref={layer} className="pv__layer">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.picture key={name} className="pv__pic"
                style={{ backgroundImage: `url(${meta.lqip})` }}
                initial={{ opacity: 0, x: reduce ? 0 : dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduce ? 0 : dir * -60 }}
                transition={{ duration: reduce ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <source type="image/avif" srcSet={set('avif')} />
                <source type="image/webp" srcSet={set('webp')} />
                <img src={set('jpg')} alt={PHOTOS[name]?.alt || ''} width={meta.w} height={meta.h} draggable={false} />
              </motion.picture>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div className="pv__top" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        <span className="pv__count glass" aria-hidden={n < 2}>{n > 1 ? `${index + 1} of ${n}` : 'Photo'}</span>
        <button ref={closeBtn} type="button" className="pv__btn glass" onClick={close} aria-label="Close photo viewer"><Close size={18} /></button>
      </motion.div>

      {n > 1 && (
        <>
          <button type="button" className="pv__btn pv__side pv__side--prev glass" onClick={() => go(-1)} aria-label="Previous photo"><Arrow size={18} dir="left" /></button>
          <button type="button" className="pv__btn pv__side pv__side--next glass" onClick={() => go(1)} aria-label="Next photo"><Arrow size={18} /></button>
        </>
      )}

      <motion.div className="pv__bottom" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: reduce ? 0 : 0.1 }}>
        <div className="pv__bar glass">
          {n > 1 && <button type="button" className="pv__btn pv__btn--flat pv__mprev" onClick={() => go(-1)} aria-label="Previous photo"><Arrow size={18} dir="left" /></button>}
          <p className="pv__cap" aria-live="polite">
            <span>{caption}</span>
            <span className="pv__sub">
              {hint ? (coarse ? 'Pinch or double-tap to zoom' : 'Click or scroll to zoom') : '\u00a0'}
            </span>
          </p>
          <button type="button" className="pv__btn pv__btn--flat" onClick={() => toggleAt(cx + z.current.x, cy + z.current.y)}
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}>
            {zoomed ? <ZoomOut /> : <ZoomIn />}
          </button>
          {n > 1 && <button type="button" className="pv__btn pv__btn--flat pv__mnext" onClick={() => go(1)} aria-label="Next photo"><Arrow size={18} /></button>}
        </div>
      </motion.div>
    </motion.div>
  );
}
