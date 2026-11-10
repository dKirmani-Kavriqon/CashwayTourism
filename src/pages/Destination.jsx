import { useParams, Link } from 'react-router-dom';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Picture from '../components/Picture.jsx';
import { ZoomPhoto } from '../components/PhotoViewer.jsx';
import Topo from '../components/Topo.jsx';
import MapView from '../components/MapView.jsx';
import { usePlanner } from '../components/Planner.jsx';
import { Arrow } from '../components/Icons.jsx';
import { DestCard } from './Home.jsx';
import NotFound from './NotFound.jsx';
import { Reveal, SplitWords, ClipReveal, EASE } from '../lib/motion.jsx';
import { DEST_BY_SLUG, EXPERIENCES, MAP_POINTS, ROUTES, SEASONS, PHOTOS } from '../data/content.js';
import { BRAND } from '../config.js';
import useSeo from '../lib/useSeo.js';

export default function Destination() {
  const { slug } = useParams();
  const d = DEST_BY_SLUG[slug];
  useSeo({
    title: d ? `${d.name}, Kashmir` : 'Not found',
    description: d ? `${d.name} (${d.meaning.toLowerCase()}): ${d.lede}` : 'Page not found.',
    path: `/destinations/${slug}`,
    image: d?.image ? `/og/${d.image}.jpg` : undefined,
    jsonLd: d && {
      '@context': 'https://schema.org', '@type': 'TouristDestination', name: `${d.name}, Kashmir`,
      description: d.lede, geo: { '@type': 'GeoCoordinates', latitude: d.coords[0], longitude: d.coords[1] },
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Jammu and Kashmir, India' },
      includesAttraction: d.attractions.map((a) => ({ '@type': 'TouristAttraction', name: a.name, description: a.note })),
      provider: { '@type': 'TravelAgency', name: BRAND.legalName, url: BRAND.url },
    },
  });
  const { open } = usePlanner();
  // Every photo that really shows this place, lead photo first, for the full-screen viewer.
  const album = d ? [d.image, ...Object.keys(PHOTOS).filter((k) => PHOTOS[k].place === d.slug && k !== d.image)].filter(Boolean) : [];
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%']);

  if (!d) return <NotFound />;
  const exps = EXPERIENCES.filter((e) => e.place === d.slug);
  const routes = ROUTES.filter((r) => r.days.some((x) => x.place === d.slug));
  const points = MAP_POINTS.filter((p) => p.dest === d.slug || d.nearby.includes(p.id));

  return (
    <article className="dest" style={{ '--accent': d.accent }}>
      <header ref={heroRef} className="dhero">
        <div className="dhero__copy wrap">
          <Reveal><Link to="/destinations" className="link-arrow back"><Arrow dir="left" /> All destinations</Link></Reveal>
          <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>{d.meaning} · {d.region}</motion.p>
          <h1 className="display dhero__title"><SplitWords text={d.name} delay={0.2} /></h1>
          <Reveal className="lede dhero__lede" delay={0.6}><p>{d.lede}</p></Reveal>
          <Reveal className="dhero__ctas" delay={0.8}>
            <button type="button" className="btn btn--primary" onClick={() => open(d.slug)}>Plan {d.name} <Arrow /></button>
            <a href="#see" className="link-arrow">What to see <Arrow /></a>
          </Reveal>
        </div>
        <div className="dhero__media">
          <ClipReveal className="dhero__clip">
            <motion.div style={{ y: imgY }} className="dhero__img" initial={reduce ? false : { scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease: EASE }}>
              {d.image ? <ZoomPhoto name={d.image} group={album} priority sizes="(min-width: 900px) 45vw, 100vw" />
                : <Topo seed={d.slug} accent={d.accent} rings={18} />}
            </motion.div>
          </ClipReveal>
          {d.image ? <p className="cap">{PHOTOS[d.image].caption}</p> : <p className="cap">Contour study of the {d.name} valley</p>}
        </div>
      </header>

      <section className="wrap facts" aria-label="At a glance">
        <dl>
          <div><dt>Altitude</dt><dd>{d.altitude}</dd></div>
          <div><dt>Getting there</dt><dd>{d.distance}</dd></div>
          <div><dt>Best seasons</dt><dd>{d.seasons.map((s) => SEASONS[s].name).join(', ')}</dd></div>
          <div><dt>Coordinates</dt><dd>{d.coords[0].toFixed(2)}° N, {d.coords[1].toFixed(2)}° E</dd></div>
        </dl>
      </section>

      <section className="section dstory" aria-labelledby="story-h">
        <div className="wrap dstory__grid">
          <h2 id="story-h" className="dstory__h"><SplitWords text={`About ${d.name}`} inView /></h2>
          <Reveal className="prose dstory__text">{d.story.map((p, i) => <p key={i}>{p}</p>)}</Reveal>
          {d.altImage && (
            <ClipReveal className="dstory__img"><ZoomPhoto name={d.altImage} group={album} sizes="(min-width: 900px) 28vw, 100vw" /><p className="cap">{PHOTOS[d.altImage].caption}</p></ClipReveal>
          )}
        </div>
      </section>

      <section id="see" className="section see dark" aria-labelledby="see-h">
        <div className="wrap see__grid">
          <div className="see__side">
            <span className="eyebrow">Top sights</span>
            <h2 id="see-h">What to see in {d.name}</h2>
          </div>
          <ol role="list" className="see__list">
            {d.attractions.map((a, i) => (
              <Reveal as="li" key={a.name} delay={i * 0.06} className="see__item">
                <span className="see__n">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{a.name}</h3><p>{a.note}</p></div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section todo" aria-labelledby="todo-h">
        <div className="wrap todo__grid">
          <div>
            <Reveal><span className="eyebrow">Things to do</span></Reveal>
            <h2 id="todo-h"><SplitWords text="How to spend your days" inView /></h2>
          </div>
          <ul role="list" className="todo__list">
            {d.todo.map((t, i) => <Reveal as="li" key={t} delay={i * 0.06}>{t}</Reveal>)}
          </ul>
        </div>
        {exps.length > 0 && (
          <div className="wrap xrow">
            {exps.map((e) => (
              <Link key={e.slug} to={`/experiences#${e.slug}`} className="xmini">
                <div className="xmini__media">{e.image ? <Picture name={e.image} sizes="240px" alt="" /> : <Topo seed={e.slug} accent={d.accent} rings={9} />}</div>
                <span className="xmini__t">{e.title}</span>
                <span className="xmini__s">{e.season}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="section when" aria-labelledby="when-h">
        <div className="wrap when__grid">
          <div>
            <Reveal><span className="eyebrow">Best time to visit</span></Reveal>
            <h2 id="when-h"><SplitWords text="When to go" inView /></h2>
          </div>
          <div>
            <div className="seasonbar" role="img" aria-label={`Best seasons: ${d.seasons.map((s) => SEASONS[s].name).join(', ')}`}>
              {Object.entries(SEASONS).map(([k, s]) => (
                <div key={k} className={`seasonbar__cell ${d.seasons.includes(k) ? 'is-on' : ''}`}>
                  <span>{s.name}</span><small>{s.months}</small>
                  {d.seasons.includes(k) && <small className="seasonbar__tag">Good time to go</small>}
                </div>
              ))}
            </div>
            <Reveal className="prose"><p>{d.bestTime}</p></Reveal>
          </div>
        </div>
      </section>

      <section className="section trio" aria-label="Culture, food and stays">
        <div className="wrap trio__grid">
          {[['Local culture', d.culture], ['Food', d.food], ['Where to stay', d.stay]].map(([h, p], i) => (
            <Reveal key={h} delay={i * 0.1} className="trio__col">
              <h2 className="trio__h">{h}</h2>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section--tight tips" aria-labelledby="tips-h">
        <div className="wrap tips__box">
          <h2 id="tips-h" className="tips__h">Good to know</h2>
          <ul role="list">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul>
          <Link to="/guides" className="link-arrow">Read the full travel guide <Arrow /></Link>
        </div>
      </section>

      <section className="section" aria-labelledby="dmap-h">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="eyebrow">Map</span></Reveal>
            <h2 id="dmap-h">{d.name} and around</h2>
          </div>
          <MapView points={points} focus={d.slug} height="64vh" />
        </div>
      </section>

      {routes.length > 0 && (
        <section className="section--tight" aria-labelledby="droutes-h">
          <div className="wrap">
            <h2 id="droutes-h" className="h-sm">Sample routes through {d.name}</h2>
            <div className="route-cards">
              {routes.map((r) => (
                <div key={r.slug} className="route-card">
                  <span className="eyebrow eyebrow--plain">{r.length} · {r.mood}</span>
                  <h3>{r.title}</h3>
                  <p className="muted">{[...new Set(r.days.map((x) => DEST_BY_SLUG[x.place].name))].join(' → ')}</p>
                  <button type="button" className="link-arrow" onClick={() => open(d.slug)}>Plan something like this <Arrow /></button>
                </div>
              ))}
            </div>
            <p className="cap">Sample routes are ideas, not fixed packages.</p>
          </div>
        </section>
      )}

      <section className="section related" aria-labelledby="rel-h">
        <div className="wrap">
          <h2 id="rel-h" className="h-sm">Nearby</h2>
          <div className="related__grid">
            {d.nearby.map((s) => <DestCard key={s} d={DEST_BY_SLUG[s]} sizes="(min-width: 900px) 30vw, 100vw" className="dcard--sm" />)}
          </div>
        </div>
      </section>

      <section className="section--tight dplan dark">
        <div className="wrap dplan__inner">
          <h2><em>Wake up in {d.name}.</em></h2>
          <button type="button" className="btn btn--primary" onClick={() => open(d.slug)}>Plan your trip <Arrow /></button>
        </div>
      </section>
    </article>
  );
}
