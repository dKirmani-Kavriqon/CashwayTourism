import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DESTINATIONS } from '../data/content.js';
import { BRAND } from '../config.js';
import { usePlanner } from './Planner.jsx';
import { Arrow, Close, Instagram } from './Icons.jsx';
import { EASE } from '../lib/motion.jsx';

const BASE = import.meta.env.BASE_URL;
const LINKS = [
  { to: '/experiences', label: 'Experiences' },
  { to: '/guides', label: 'Travel guide' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const { open } = usePlanner();
  const loc = useLocation();
  const reduce = useReducedMotion();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMenu(false); setDrop(false); }, [loc.pathname]);
  useEffect(() => {
    if (!menu) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [menu]);
  useEffect(() => {
    if (!drop) return;
    const onKey = (e) => e.key === 'Escape' && setDrop(false);
    const onDown = (e) => { if (!dropRef.current?.contains(e.target)) setDrop(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown); };
  }, [drop]);

  return (
    <>
      <motion.header
        className={`nav ${solid ? 'is-solid' : ''}`}
        initial={reduce ? false : { y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      >
        <div className="nav__inner wrap">
          <Link to="/" className="brand" aria-label="KashWay home">
            <img src={`${BASE}logo-96.png`} width="40" height="40" alt="" />
            <span className="wordmark">Kashway</span>
          </Link>

          <nav className="nav__links" aria-label="Main">
            <div className={`nav__drop ${drop ? 'is-open' : ''}`} ref={dropRef}
              onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
              <NavLink to="/destinations" className="nav__link" onFocus={() => setDrop(false)}>Destinations</NavLink>
              <button type="button" className="nav__caret" aria-expanded={drop} aria-controls="dest-menu"
                aria-label="Show destinations" onClick={(e) => setDrop((v) => (e.detail === 0 ? !v : true))}>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </button>
              <AnimatePresence>
                {drop && (
                  <motion.div id="dest-menu" className="drop"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, ease: EASE }}>
                    <ul role="list">
                      {DESTINATIONS.map((d) => (
                        <li key={d.slug}>
                          <Link to={`/destinations/${d.slug}`} className="drop__item">
                            <span className="drop__name">{d.name}</span>
                            <span className="drop__meta">{d.meaning}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to="/destinations" className="link-arrow">All destinations and the map <Arrow /></Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {LINKS.map((l) => <NavLink key={l.to} to={l.to} className="nav__link">{l.label}</NavLink>)}
          </nav>

          <div className="nav__end">
            <button type="button" className="btn btn--primary nav__cta" onClick={() => open()}>Plan your trip</button>
            <button type="button" className="menu-btn" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu(true)}>
              <span className="sr-only">Open menu</span>
              <span className="menu-btn__lines" aria-hidden="true"><i /><i /></span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div id="mobile-menu" className="mmenu dark" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.65, 0, 0.35, 1] }}>
            <div className="mmenu__top wrap">
              <span className="wordmark">Kashway</span>
              <button type="button" className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu" autoFocus><Close /></button>
            </div>
            <motion.ul role="list" className="mmenu__list wrap" initial="h" animate="s"
              variants={{ s: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}>
              {[{ to: '/', label: 'Home' }, { to: '/destinations', label: 'Destinations' }, ...LINKS, { to: '/plan', label: 'Plan a trip' }].map((l) => (
                <motion.li key={l.to} variants={{ h: { opacity: 0, y: 24 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>
                  <NavLink to={l.to} end className="mmenu__link">{l.label}</NavLink>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mmenu__foot wrap">
              <p className="muted">{BRAND.city}</p>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow"><Instagram /> {BRAND.instagramHandle}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
