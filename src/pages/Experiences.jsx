import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ZoomPhoto } from '../components/PhotoViewer.jsx';
import Topo from '../components/Topo.jsx';
import { usePlanner } from '../components/Planner.jsx';
import { Arrow } from '../components/Icons.jsx';
import { Reveal, SplitWords, EASE } from '../lib/motion.jsx';
import { EXPERIENCES, EXPERIENCE_CATEGORIES, DEST_BY_SLUG, PHOTOS } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

export default function Experiences() {
  useSeo('/experiences');
  const [params, setParams] = useSearchParams();
  const cat = params.get('c') || 'all';
  const setCat = (c) => setParams(c === 'all' ? {} : { c }, { replace: true, preventScrollReset: true });
  const list = useMemo(() => EXPERIENCES.filter((e) => cat === 'all' || e.cats.includes(cat)), [cat]);
  const { open } = usePlanner();
  const album = useMemo(() => [...new Set(list.map((e) => e.image).filter(Boolean))], [list]);

  return (
    <>
      <header className="phead">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">Experiences</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="Not just places." /> <em><SplitWords text="Moments." delay={0.2} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}>
            <p>Adventure, culture, food and slow days. Pick what you love and we’ll fit it into your route.</p>
          </Reveal>
        </div>
      </header>

      <div className="wrap xfilter">
        <div className="chips" role="group" aria-label="Filter experiences">
          <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>Everything</button>
          {Object.entries(EXPERIENCE_CATEGORIES).map(([k, v]) => (
            <button key={k} type="button" className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>{v}</button>
          ))}
        </div>
        <p className="finder__count" aria-live="polite">{list.length} experiences</p>
      </div>

      <section className="wrap xlist" aria-label="Experiences">
        <AnimatePresence mode="popLayout">
          {list.map((e, i) => {
            const d = e.place && DEST_BY_SLUG[e.place];
            return (
              <motion.article key={e.slug} id={e.slug} layout className={`xitem ${e.image ? 'has-img' : ''} ${i % 2 ? 'is-flip' : ''}`}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}>
                <div className="xitem__media">
                  {e.image ? <ZoomPhoto name={e.image} group={album} sizes="(min-width: 900px) 40vw, 100vw" label={`Enlarge photo: ${e.title}`} />
                    : <Topo seed={e.slug} accent={d?.accent || '#4b6b3a'} rings={11} />}
                </div>
                <div className="xitem__body">
                  <p className="xitem__meta">
                    {d ? <Link to={`/destinations/${d.slug}`}>{d.name}</Link> : 'High pastures'} · {e.season}
                  </p>
                  <h2 className="xitem__t">{e.title}</h2>
                  <p className="xitem__p">{e.text}</p>
                  <p className="xitem__cats">{e.cats.map((c) => EXPERIENCE_CATEGORIES[c]).join(' · ')}</p>
                  <button type="button" className="link-arrow" onClick={() => open(e.place || undefined)}>Add to my trip <Arrow /></button>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </section>
    </>
  );
}
