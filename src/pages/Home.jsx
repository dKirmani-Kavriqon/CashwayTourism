import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Picture from '../components/Picture.jsx';
import Topo from '../components/Topo.jsx';
import MapView from '../components/MapView.jsx';
import { PlaceTiles, usePlanner } from '../components/Planner.jsx';
import { Arrow, Instagram } from '../components/Icons.jsx';
import { Reveal, SplitWords, ClipReveal, EASE, EASE_FILM } from '../lib/motion.jsx';
import { DESTINATIONS, DEST_BY_SLUG, EXPERIENCES, PHOTOS, ROUTES } from '../data/content.js';
import { BRAND } from '../config.js';
import useSeo from '../lib/useSeo.js';

export default function Home() {
  useSeo({
    description: 'KashWay Tour & Travels plans tours, stays and experiences across Kashmir: Dal Lake houseboats, Gulmarg snow, Sonamarg glaciers and the meadows of Pahalgam. Based in Srinagar.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <Statement />
      <Seasons />
      <Featured />
      <ExperienceIndex />
      <GalleryStrip />
      <Routes />
      <section className="section" aria-labelledby="map-h">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="eyebrow">The map</span></Reveal>
            <h2 id="map-h"><SplitWords text="Find your way around the valley" inView /></h2>
            <Reveal className="prose" delay={0.1}><p>Filter by what you’re looking for, open a place for a preview, and get directions straight to it.</p></Reveal>
          </div>
          <Reveal><MapView height="72vh" /></Reveal>
        </div>
      </section>
      <Trust />
      <PlanSection />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */
function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { open } = usePlanner();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yA = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-28%']);
  const yC = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-20%']);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);
  const zoom = (d) => (reduce ? {} : { initial: { scale: 1.25 }, animate: { scale: 1 }, transition: { duration: 3.2, ease: EASE, delay: d } });

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-h">
      <div className="hero__fog" aria-hidden="true"><i /><i /><i /></div>

      <motion.div className="hero__copy" style={{ opacity: fade }}>
        <motion.p className="hero__loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
          <span className="hero__dot" aria-hidden="true" /> Srinagar, Kashmir <span className="hero__coord">34.08° N · 74.80° E</span>
        </motion.p>
        <h1 id="hero-h" className="display hero__title">
          <SplitWords as="span" text="Discover Kashmir," delay={0.5} className="hero__l1" />
          <SplitWords as="span" text="the way it’s" delay={0.7} className="hero__l2" />
          <SplitWords as="span" text="meant to be." delay={0.85} className="hero__l3" />
        </h1>
        <motion.p className="hero__sub lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 1.3 }}>
          Tours, stays and experiences across the valley, planned from Srinagar. Tell us where you want to wake up and we’ll shape the rest.
        </motion.p>
        <motion.div className="hero__ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: EASE, delay: 1.5 }}>
          <button type="button" className="btn btn--primary" onClick={() => open()}>Plan your trip <Arrow /></button>
          <Link to="/destinations" className="link-arrow">Explore destinations <Arrow /></Link>
        </motion.div>
      </motion.div>

      <div className="hero__stage">
        <motion.figure className="hero__ph hero__ph--a" style={{ y: yA }}>
          <ClipReveal delay={0.2} className="hero__clip">
            <motion.div className="hero__zoom" {...zoom(0.2)}>
              <Picture name="dal-autumn" priority sizes="(min-width: 900px) 34vw, 100vw" />
            </motion.div>
          </ClipReveal>
          <figcaption className="cap">{PHOTOS['dal-autumn'].caption}</figcaption>
        </motion.figure>
        <motion.figure className="hero__ph hero__ph--b" style={{ y: yB }}>
          <ClipReveal delay={0.55} className="hero__clip">
            <motion.div className="hero__zoom" {...zoom(0.55)}>
              <Picture name="gulmarg-gondola" priority sizes="(min-width: 900px) 18vw, 40vw" />
            </motion.div>
          </ClipReveal>
          <figcaption className="cap">Gulmarg</figcaption>
        </motion.figure>
        <motion.figure className="hero__ph hero__ph--c" style={{ y: yC }}>
          <ClipReveal delay={0.8} className="hero__clip">
            <motion.div className="hero__zoom" {...zoom(0.8)}>
              <Picture name="sonamarg-bridge" sizes="(min-width: 900px) 16vw, 36vw" />
            </motion.div>
          </ClipReveal>
          <figcaption className="cap">Sonamarg</figcaption>
        </motion.figure>
      </div>

      <motion.div className="hero__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.9 }}>
        <a href="#statement" className="scrollcue">
          <span className="scrollcue__line" aria-hidden="true"><i /></span>
          <span>Scroll to begin</span>
        </a>
        <p className="hero__offer">{BRAND.offer.join(' · ')}</p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------- Statement */
const STATEMENT = 'Kashmir isn’t something to see from a coach window. It’s a dawn shikara through mist, a cup of kahwa on a houseboat veranda, snow falling on a meadow you have entirely to yourself.';

function Statement() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = STATEMENT.split(' ');
  const [lit, setLit] = useState(reduce ? words.length : 0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (!reduce) setLit(Math.round(v * words.length)); });

  return (
    <section id="statement" className="section statement" aria-labelledby="statement-h">
      <div className="wrap statement__grid">
        <Reveal className="statement__aside">
          <span className="eyebrow">{BRAND.teaser}</span>
        </Reveal>
        <div>
          <h2 id="statement-h" className="sr-only">About travelling with KashWay</h2>
          <p ref={ref} className="statement__text" aria-label={STATEMENT}>
            {words.map((w, i) => (
              <span key={i} aria-hidden="true" className={i < lit ? 'is-lit' : ''}>{w} </span>
            ))}
          </p>
          <div className="pillars">
            {[
              { h: 'Tours', p: 'Routes through the valleys, with drivers who know the mountain roads.', to: '/destinations' },
              { h: 'Stays', p: 'Carved houseboats, mountain lodges and family homestays.', to: '/experiences?c=luxury' },
              { h: 'Experiences', p: 'Shikara dawns, gondola rides, craft lanes and wazwan.', to: '/experiences' },
            ].map((p, i) => (
              <Reveal key={p.h} delay={i * 0.1} className="pillar">
                <Link to={p.to}>
                  <span className="pillar__n">{p.h}</span>
                  <span className="pillar__p">{p.p}</span>
                  <Arrow />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Seasons */
const SEASON_PANELS = [
  { key: 'spring', name: 'Spring', months: 'March to May', img: 'papier-mache', imgNote: 'The valley’s flowers, painted by hand in papier-mâché',
    text: 'Almond and apple blossom, and Srinagar’s tulip garden in brief, brilliant bloom.', to: '/destinations/srinagar' },
  { key: 'summer', name: 'Summer', months: 'June to August', img: 'doodhpathri',
    text: 'Green meadows, open passes, and shepherds driving their flocks to the high pastures.', to: '/destinations/doodhpathri' },
  { key: 'autumn', name: 'Autumn', months: 'September to November', img: 'dal-autumn',
    text: 'Clear skies, saffron harvests, and the chinars turning the lakeshore red and gold.', to: '/destinations/srinagar' },
  { key: 'winter', name: 'Winter', months: 'December to February', img: 'gulmarg-gondola',
    text: 'Snow on Gulmarg’s slopes, misty lake mornings, and kahwa by the stove.', to: '/destinations/gulmarg' },
];

function Seasons() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);
  return (
    <section ref={ref} className={`seasons dark ${reduce ? 'is-static' : ''}`} aria-labelledby="seasons-h">
      <div className="seasons__sticky">
        <div className="seasons__head wrap">
          <span className="eyebrow">Four seasons, four valleys</span>
          <h2 id="seasons-h">There is no wrong time. <em>Only a different Kashmir.</em></h2>
        </div>
        <motion.ol role="list" className="seasons__track" style={reduce ? undefined : { x }}>
          {SEASON_PANELS.map((s, i) => (
            <li key={s.key} className="season">
              <div className="season__media">
                <Picture name={s.img} sizes="(min-width: 900px) 30vw, 80vw" alt={PHOTOS[s.img].alt} />
                <span className="cap">{s.imgNote || PHOTOS[s.img].caption}</span>
              </div>
              <div className="season__text">
                <span className="season__i">{String(i + 1).padStart(2, '0')} / 04</span>
                <h3 className="season__name">{s.name}</h3>
                <p className="season__months">{s.months}</p>
                <p>{s.text}</p>
                <Link to={s.to} className="link-arrow">Where to go <Arrow /></Link>
              </div>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Featured */
export function DestCard({ d, sizes, className = '', priority }) {
  return (
    <Link to={`/destinations/${d.slug}`} className={`dcard ${className}`}>
      <div className="dcard__media">
        {d.image
          ? <Picture name={d.image} sizes={sizes} priority={priority} />
          : <Topo seed={d.slug} accent={d.accent} />}
      </div>
      <div className="dcard__body">
        <span className="dcard__meaning">{d.meaning}</span>
        <h3 className="dcard__name">{d.name}</h3>
        <p className="dcard__lede">{d.lede}</p>
        <span className="dcard__cta">Explore {d.name} <Arrow /></span>
      </div>
    </Link>
  );
}

function Featured() {
  const [a, b, c] = ['srinagar', 'gulmarg', 'sonamarg'].map((s) => DEST_BY_SLUG[s]);
  const rest = DESTINATIONS.filter((d) => !['srinagar', 'gulmarg', 'sonamarg'].includes(d.slug));
  const [hover, setHover] = useState(rest[0].slug);
  return (
    <section className="section featured" aria-labelledby="featured-h">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <Reveal><span className="eyebrow">Destinations</span></Reveal>
            <h2 id="featured-h"><SplitWords text="Lakes, meadows and mountain snow" inView /></h2>
          </div>
          <Reveal className="prose" delay={0.15}>
            <p>Most journeys begin in Srinagar and fan out into the valleys. Each has its own season, character and pace.</p>
            <Link to="/destinations" className="link-arrow">All destinations <Arrow /></Link>
          </Reveal>
        </div>

        <div className="featured__grid">
          <ClipReveal className="featured__a"><DestCard d={a} sizes="(min-width: 900px) 55vw, 100vw" /></ClipReveal>
          <ClipReveal className="featured__b" delay={0.15}><DestCard d={b} sizes="(min-width: 900px) 34vw, 100vw" /></ClipReveal>
          <ClipReveal className="featured__c" delay={0.3}><DestCard d={c} sizes="(min-width: 900px) 30vw, 100vw" /></ClipReveal>
        </div>

        <div className="further">
          <Reveal as="h3" className="further__h">Further into the valleys</Reveal>
          <ul role="list" className="further__list">
            {rest.map((d, i) => (
              <Reveal as="li" key={d.slug} delay={i * 0.08}>
                <Link to={`/destinations/${d.slug}`} className="further__row" onMouseEnter={() => setHover(d.slug)} onFocus={() => setHover(d.slug)}>
                  <span className="further__name">{d.name}</span>
                  <span className="further__meaning">{d.meaning}</span>
                  <span className="further__meta">{d.altitude}</span>
                  <span className="further__go" aria-hidden="true"><Arrow /></span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="further__preview" aria-hidden="true">
            {rest.map((d) => (
              <motion.div key={d.slug} className="further__plate" initial={false}
                animate={{ opacity: hover === d.slug ? 1 : 0, scale: hover === d.slug ? 1 : 1.04 }} transition={{ duration: 0.6, ease: EASE }}>
                <Topo seed={d.slug} accent={d.accent} label={d.name} sub={d.distance} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------- Experience index */
function ExperienceIndex() {
  const list = EXPERIENCES.slice(0, 7);
  const [cur, setCur] = useState(null);
  const box = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  const curExp = list.find((e) => e.slug === cur);
  return (
    <section className="section xindex dark" aria-labelledby="xindex-h">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <Reveal><span className="eyebrow">Experiences</span></Reveal>
            <h2 id="xindex-h"><SplitWords text="The moments you’ll keep" inView /></h2>
          </div>
          <Reveal className="prose" delay={0.15}>
            <p>Some are famous, some only locals know. All of them can be woven into your trip.</p>
            <Link to="/experiences" className="link-arrow">All experiences <Arrow /></Link>
          </Reveal>
        </div>
        <div className="xindex__box" ref={box} onMouseMove={onMove} onMouseLeave={() => setCur(null)}>
          <ul role="list" className="xindex__list">
            {list.map((e, i) => (
              <Reveal as="li" key={e.slug} delay={i * 0.05}>
                <Link to={`/experiences#${e.slug}`} className="xindex__row" onMouseEnter={() => setCur(e.slug)}>
                  <span className="xindex__i">{String(i + 1).padStart(2, '0')}</span>
                  <span className="xindex__title">{e.title}</span>
                  <span className="xindex__place">{e.place ? DEST_BY_SLUG[e.place].name : 'High pastures'}</span>
                  <span className="xindex__season">{e.season}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <motion.div className="xindex__float" aria-hidden="true"
            animate={{ x: pos.x, y: pos.y, opacity: curExp ? 1 : 0, scale: curExp ? 1 : 0.9 }}
            transition={{ x: { type: 'spring', stiffness: 160, damping: 22 }, y: { type: 'spring', stiffness: 160, damping: 22 }, opacity: { duration: 0.25 }, scale: { duration: 0.35 } }}>
            {curExp && (curExp.image
              ? <Picture name={curExp.image} sizes="280px" alt="" />
              : <Topo seed={curExp.slug} accent={DEST_BY_SLUG[curExp.place]?.accent} rings={10} />)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- Gallery strip */
function GalleryStrip() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [140, -140]);
  const y3 = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [20, -20]);
  const items = [
    { n: 'houseboat', y: y1, c: 'gs__a' },
    { n: 'high-meadow', y: y2, c: 'gs__b' },
    { n: 'papier-mache', y: y3, c: 'gs__c' },
    { n: 'yusmarg', y: y2, c: 'gs__d' },
  ];
  return (
    <section ref={ref} className="section gstrip" aria-labelledby="gs-h">
      <div className="wrap">
        <div className="gstrip__grid">
          <div className="gstrip__text">
            <Reveal><span className="eyebrow">Gallery</span></Reveal>
            <h2 id="gs-h"><SplitWords text="Carved cedar, painted flowers, folded rock" inView /></h2>
            <Reveal delay={0.15}><Link to="/gallery" className="btn">Open the gallery <Arrow /></Link></Reveal>
          </div>
          {items.map((it) => (
            <motion.figure key={it.n} className={`gs ${it.c}`} style={{ y: it.y }}>
              <Link to="/gallery" aria-label={`Open the gallery: ${PHOTOS[it.n].caption}`}>
                <ClipReveal><Picture name={it.n} sizes="(min-width: 900px) 24vw, 50vw" /></ClipReveal>
              </Link>
              <figcaption className="cap">{PHOTOS[it.n].caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Routes */
function Routes() {
  const [i, setI] = useState(1);
  const r = ROUTES[i];
  const { open } = usePlanner();
  return (
    <section className="section routes" aria-labelledby="routes-h">
      <div className="wrap routes__grid">
        <div className="routes__side">
          <Reveal><span className="eyebrow">Sample routes</span></Reveal>
          <h2 id="routes-h"><SplitWords text="A shape for your days" inView /></h2>
          <Reveal className="prose" delay={0.1}>
            <p>Ideas to start from, not fixed packages. Every KashWay trip is planned around your dates, your pace and who you’re travelling with.</p>
          </Reveal>
          <div className="routes__tabs" role="tablist" aria-label="Sample routes">
            {ROUTES.map((x, k) => (
              <button key={x.slug} role="tab" id={`tab-${x.slug}`} aria-controls="route-panel" aria-selected={k === i} className="routes__tab" onClick={() => setI(k)}>
                <span className="routes__tab-t">{x.title}</span>
                <span className="routes__tab-m">{x.length} · {x.mood}</span>
              </button>
            ))}
          </div>
        </div>
        <div id="route-panel" role="tabpanel" aria-labelledby={`tab-${r.slug}`} className="routes__panel">
          <motion.ol key={r.slug} role="list" className="days-list" initial="h" animate="s"
            variants={{ s: { transition: { staggerChildren: 0.07 } } }}>
            {r.days.map((d, k) => (
              <motion.li key={k} className="days-list__item" variants={{ h: { opacity: 0, x: 20 }, s: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}>
                <span className="days-list__day">Day {k + 1}</span>
                <span className="days-list__place">{DEST_BY_SLUG[d.place].name}</span>
                <span className="days-list__text">{d.text}</span>
              </motion.li>
            ))}
          </motion.ol>
          <button type="button" className="btn btn--primary" onClick={() => open(r.days[0].place)}>Plan a trip like this <Arrow /></button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Trust */
function Trust() {
  return (
    <section className="section trust" aria-labelledby="trust-h">
      <div className="wrap trust__grid">
        <Reveal className="trust__media">
          <Picture name="houseboat" sizes="(min-width: 900px) 34vw, 100vw" />
        </Reveal>
        <div>
          <Reveal><span className="eyebrow">Why KashWay</span></Reveal>
          <h2 id="trust-h"><SplitWords text="Planned from Srinagar, by the people who live here" inView /></h2>
          <dl className="trust__list">
            {[
              ['Recognised', 'KashWay Tour & Travels is recognised by the Jammu & Kashmir Tourism Department.'],
              ['Local', 'We’re based in Srinagar. The roads, the seasons and the people are home for us.'],
              ['Personal', 'Every trip starts as a conversation, not a package. A real person replies to every enquiry.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.1} className="trust__item">
                <dt>{t}</dt><dd>{d}</dd>
              </Reveal>
            ))}
          </dl>
          <Reveal delay={0.3}>
            <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="link-arrow">
              <Instagram /> Follow the journey on Instagram {BRAND.instagramHandle}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------- Plan section */
function PlanSection() {
  return (
    <section className="section plan-sec" id="plan" aria-labelledby="plan-h">
      <div className="wrap">
        <div className="sec-head sec-head--center">
          <Reveal><span className="eyebrow">Plan your trip</span></Reveal>
          <h2 id="plan-h"><SplitWords text="Where do you want to wake up?" inView /></h2>
          <Reveal className="prose" delay={0.1}><p>Tap a place to begin. A few quick questions, one at a time, and your trip is with us.</p></Reveal>
        </div>
        <Reveal><PlaceTiles /></Reveal>
      </div>
    </section>
  );
}
