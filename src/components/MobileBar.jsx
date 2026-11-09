import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePlanner } from './Planner.jsx';
import { Arrow, Pin } from './Icons.jsx';

/*
  Phone-only bottom bar. The HIG notes that the middle and bottom of the screen are the
  easiest places to reach one-handed, so the main action lives here on small screens.
  It steps aside while you scroll down to read, comes back when you scroll up,
  and hides over the footer (which has its own call to action) and on the Plan page.
*/
export default function MobileBar() {
  const { open } = usePlanner();
  const loc = useLocation();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const footer = () => document.querySelector('.footer');
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const f = footer();
      const overFooter = f ? f.getBoundingClientRect().top < window.innerHeight - 40 : false;
      const past = y > window.innerHeight * 0.55;
      const goingUp = y < lastY - 2;
      const goingDown = y > lastY + 6;
      setShow((s) => {
        if (!past || overFooter) return false;
        if (goingUp) return true;
        if (goingDown) return false;
        return s;
      });
      lastY = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    setShow(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [loc.pathname]);

  if (loc.pathname === '/plan') return null;
  const dest = loc.pathname.match(/^\/destinations\/([a-z-]+)/)?.[1];

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="mbar" role="region" aria-label="Quick actions"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          transition={reduce ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 34 }}>
          <div className="mbar__in glass">
            <Link to="/destinations" className="mbar__link"><Pin /> <span>Places</span></Link>
            <button type="button" className="btn btn--primary mbar__cta" onClick={() => open(dest)}>Plan your trip <Arrow /></button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
