import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Picture from './Picture.jsx';
import { PHOTOS } from '../data/content.js';
import { Arrow, Close } from './Icons.jsx';
import { EASE } from '../lib/motion.jsx';

export default function Lightbox({ items, index, onClose, onIndex }) {
  const touch = useRef(null);
  const closeRef = useRef(null);
  const n = items.length;
  const go = (d) => onIndex((index + d + n) % n);

  useEffect(() => {
    if (index == null) return;
    const prevFocus = document.activeElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener('keydown', onKey); prevFocus?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index == null, index]);

  return (
    <AnimatePresence>
      {index != null && (
        <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
          onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (touch.current ?? 0); if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); }}>
          <button type="button" className="lightbox__bg" aria-hidden="true" tabIndex={-1} onClick={onClose} />
          <AnimatePresence mode="wait">
            <motion.figure key={items[index]} className="lightbox__fig"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: EASE }}>
              <Picture name={items[index]} sizes="90vh" priority className="lightbox__pic" />
              <figcaption>
                <span>{PHOTOS[items[index]]?.caption}</span>
                <span className="muted">{index + 1} / {n}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <button type="button" className="icon-btn lightbox__close" onClick={onClose} ref={closeRef} aria-label="Close photo viewer"><Close /></button>
          <button type="button" className="icon-btn lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo"><Arrow size={20} dir="left" /></button>
          <button type="button" className="icon-btn lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo"><Arrow size={20} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
