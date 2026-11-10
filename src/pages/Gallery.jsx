import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoomPhoto } from '../components/PhotoViewer.jsx';
import { Reveal, SplitWords, EASE } from '../lib/motion.jsx';
import { PHOTOS } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

const ORDER = [
  'great-lakes', 'dal-autumn', 'gulmarg-skiing', 'betaab-valley', 'hazratbal', 'pahalgam', 'tulip-garden', 'shalimar-bagh',
  'gulmarg-gondola', 'noon-chai', 'aru-valley', 'jamia-masjid', 'yusmarg', 'nishat-bagh', 'houseboat', 'thajiwas-glacier',
  'first-snow', 'tulip-rows', 'doodhpathri', 'wazwan', 'sonamarg-bridge', 'high-meadow', 'papier-mache',
];
const FILTERS = { all: 'All', landscape: 'Landscapes', nature: 'Meadows', seasons: 'Seasons', culture: 'Culture & craft', food: 'Food', adventure: 'Adventure' };

export default function Gallery() {
  useSeo('/gallery');
  const [f, setF] = useState('all');
  const items = useMemo(() => ORDER.filter((n) => f === 'all' || PHOTOS[n].tags.includes(f)), [f]);

  return (
    <>
      <header className="phead">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">Gallery</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="The valley," /> <em><SplitWords text="frame by frame." delay={0.2} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}><p>Tap any photograph to see it full screen. Pinch, double-tap or scroll to zoom in, and swipe or use the arrow keys to move between them.</p></Reveal>
        </div>
      </header>
      <div className="wrap xfilter">
        <div className="chips" role="group" aria-label="Filter photographs">
          {Object.entries(FILTERS).map(([k, v]) => (
            <button key={k} type="button" className="chip" aria-pressed={f === k} onClick={() => setF(k)}>{v}</button>
          ))}
        </div>
      </div>
      <section className="wrap masonry" aria-label="Photographs">
        <AnimatePresence mode="popLayout">
          {items.map((n, i) => (
            <motion.figure key={n} layout className="masonry__item"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}>
              <ZoomPhoto name={n} group={items} className="masonry__btn" sizes="(min-width: 1100px) 32vw, (min-width: 640px) 48vw, 100vw" />
              <figcaption className="cap">{PHOTOS[n].caption}</figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </section>
    </>
  );
}
