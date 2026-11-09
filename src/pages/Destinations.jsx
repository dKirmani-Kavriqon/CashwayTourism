import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MapView from '../components/MapView.jsx';
import { DestCard } from './Home.jsx';
import { Reveal, SplitWords, EASE } from '../lib/motion.jsx';
import { DESTINATIONS, SEASONS, KINDS } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

export default function Destinations() {
  useSeo({
    title: 'Destinations in Kashmir',
    description: 'Srinagar, Gulmarg, Sonamarg, Pahalgam, Doodhpathri and Yusmarg: when to go, what to do and where to stay, with an interactive map.',
    path: '/destinations',
  });
  const [q, setQ] = useState('');
  const [season, setSeason] = useState('all');
  const [kind, setKind] = useState('all');

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return DESTINATIONS.filter((d) =>
      (season === 'all' || d.seasons.includes(season)) &&
      (kind === 'all' || d.kinds.includes(kind)) &&
      (!t || [d.name, d.meaning, d.lede, d.region, ...d.attractions.map((a) => a.name)].join(' ').toLowerCase().includes(t)));
  }, [q, season, kind]);

  return (
    <>
      <header className="phead">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">Destinations</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="Six valleys," /> <em><SplitWords text="one Kashmir." delay={0.2} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}>
            <p>From the lakes of Srinagar to the glaciers above Sonamarg. Search by name or sight, or filter by the season you’re coming in.</p>
          </Reveal>
        </div>
      </header>

      <section className="wrap finder" aria-label="Find a destination">
        <label className="search">
          <span className="sr-only">Search destinations</span>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input type="search" placeholder="Search: Dal Lake, gondola, glacier…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="finder__filters">
          <div className="chips" role="group" aria-label="Season">
            <button type="button" className="chip" aria-pressed={season === 'all'} onClick={() => setSeason('all')}>Any season</button>
            {Object.entries(SEASONS).map(([k, s]) => (
              <button key={k} type="button" className="chip" aria-pressed={season === k} onClick={() => setSeason(k)}>{s.name}</button>
            ))}
          </div>
          <div className="chips" role="group" aria-label="Type of place">
            <button type="button" className="chip" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>All places</button>
            {Object.entries(KINDS).map(([k, v]) => (
              <button key={k} type="button" className="chip" aria-pressed={kind === k} onClick={() => setKind(k)}>{v}</button>
            ))}
          </div>
        </div>
        <p className="finder__count" aria-live="polite">{list.length} {list.length === 1 ? 'destination' : 'destinations'}</p>
      </section>

      <section className="wrap dgrid" aria-label="Destinations">
        <AnimatePresence mode="popLayout">
          {list.map((d, i) => (
            <motion.div key={d.slug} layout className={`dgrid__item dgrid__item--${i % 5}`}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}>
              <DestCard d={d} sizes="(min-width: 900px) 45vw, 100vw" priority={i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
        {!list.length && (
          <div className="empty">
            <p className="lede">Nothing matches that yet.</p>
            <button type="button" className="btn" onClick={() => { setQ(''); setSeason('all'); setKind('all'); }}>Clear search and filters</button>
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="dmap-h">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="eyebrow">Map</span></Reveal>
            <h2 id="dmap-h"><SplitWords text="Every place, in its place" inView /></h2>
          </div>
          <MapView height="76vh" />
          <p className="cap map-note">Locations are approximate. Use Directions to navigate. <Link to="/guides#getting-around">Getting around Kashmir</Link></p>
        </div>
      </section>
    </>
  );
}
