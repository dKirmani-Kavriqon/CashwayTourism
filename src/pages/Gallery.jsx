import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Picture from '../components/Picture.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { Expand } from '../components/Icons.jsx';
import { Reveal, SplitWords, EASE } from '../lib/motion.jsx';
import { PHOTOS } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

const ORDER = ['dal-autumn', 'gulmarg-gondola', 'houseboat', 'high-meadow', 'sonamarg-bridge', 'papier-mache'];
const FILTERS = { all: 'All', landscape: 'Landscapes', seasons: 'Seasons', culture: 'Culture & craft', adventure: 'Adventure' };

export default function Gallery() {
  useSeo({
    title: 'Gallery',
    description: 'Photographs of Kashmir: Dal Lake in autumn, Gulmarg in snow, Sonamarg, houseboats, high pastures and papier-mâché craft.',
    path: '/gallery',
  });
  const [f, setF] = useState('all');
  const [idx, setIdx] = useState(null);
  const items = useMemo(() => ORDER.filter((n) => f === 'all' || PHOTOS[n].tags.includes(f)), [f]);

  return (
    <>
      <header className="phead">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">Gallery</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="The valley," /> <em><SplitWords text="frame by frame." delay={0.2} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}><p>Select any photograph to see it full screen. Use the arrow keys or swipe to move between them.</p></Reveal>
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
              <button type="button" className="masonry__btn" onClick={() => setIdx(i)} aria-label={`View larger: ${PHOTOS[n].caption}`}>
                <Picture name={n} sizes="(min-width: 1100px) 32vw, (min-width: 640px) 48vw, 100vw" />
                <span className="masonry__zoom" aria-hidden="true"><Expand /></span>
              </button>
              <figcaption className="cap">{PHOTOS[n].caption}</figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </section>
      <Lightbox items={items} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} />
    </>
  );
}
