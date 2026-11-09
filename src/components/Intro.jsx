import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BRAND } from '../config.js';
import { EASE } from '../lib/motion.jsx';

/** A brief opening title card in mist, shown once per visit. Click or any key skips it. */
export default function Intro() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('kw-intro'); } catch { return false; }
  });
  useEffect(() => {
    if (!show) return;
    try { sessionStorage.setItem('kw-intro', '1'); } catch { /* ignore */ }
    const t = setTimeout(() => setShow(false), reduce ? 600 : 2300);
    const skip = () => setShow(false);
    window.addEventListener('keydown', skip);
    return () => { clearTimeout(t); window.removeEventListener('keydown', skip); };
  }, [show, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="intro" onClick={() => setShow(false)} aria-hidden="true"
          exit={{ opacity: 0, transition: { duration: 1.1, ease: EASE } }}>
          <div className="intro__fog" />
          <motion.p className="intro__word wordmark" initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.32em' }} transition={{ duration: 1.6, ease: EASE }}>
            Kashway
          </motion.p>
          <motion.p className="intro__line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.6 }}>
            {BRAND.teaser}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
