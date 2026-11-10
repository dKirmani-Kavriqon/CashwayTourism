import { Link } from 'react-router-dom';
import { ZoomPhoto } from '../components/PhotoViewer.jsx';
import { usePlanner } from '../components/Planner.jsx';
import { Arrow, Instagram } from '../components/Icons.jsx';
import { Reveal, SplitWords, ClipReveal } from '../lib/motion.jsx';
import { BRAND } from '../config.js';
import { PHOTOS } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

export default function About() {
  useSeo('/about');
  const { open } = usePlanner();
  return (
    <>
      <header className="ahero">
        <div className="wrap ahero__grid">
          <div className="ahero__copy">
            <Reveal><span className="eyebrow">About KashWay</span></Reveal>
            <h1 className="display"><SplitWords text="Kashmir is about to be" /> <em><SplitWords text="experienced differently." delay={0.3} /></em></h1>
          </div>
          <ClipReveal className="ahero__img">
            <ZoomPhoto name="teaser" priority sizes="(min-width: 900px) 38vw, 100vw" />
            <p className="cap">{PHOTOS.teaser.caption}</p>
          </ClipReveal>
        </div>
      </header>

      <section className="section about-story" aria-labelledby="story-h">
        <div className="wrap about-story__grid">
          <h2 id="story-h"><SplitWords text="Our story" inView /></h2>
          <Reveal className="prose">
            <p className="lede">KashWay is a travel company from Srinagar. We plan tours, stays and experiences across the Kashmir valley.</p>
            <p>Our name is a promise: Kashmir, the way it’s meant to be. That means slowing down on the lake at dawn, eating where Kashmiris eat, meeting the craftspeople whose work you take home, and seeing the valleys at the right time of year, not just the busiest one.</p>
            <p>We are recognised by the Jammu & Kashmir Tourism Department, and every trip we plan starts with a conversation about what you want from it.</p>
          </Reveal>
        </div>
      </section>

      <section className="section mv dark" aria-label="Mission and vision">
        <div className="wrap mv__grid">
          <Reveal className="mv__col">
            <span className="eyebrow">Mission</span>
            <p className="mv__text">To plan journeys through Kashmir that feel personal, unhurried and true to the place.</p>
          </Reveal>
          <Reveal className="mv__col" delay={0.15}>
            <span className="eyebrow">Vision</span>
            <p className="mv__text">A Kashmir that visitors leave understanding, not just having seen.</p>
          </Reveal>
        </div>
      </section>

      <section className="section diff" aria-labelledby="diff-h">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><span className="eyebrow">What makes us different</span></Reveal>
            <h2 id="diff-h"><SplitWords text="Local, personal, recognised" inView /></h2>
          </div>
          <div className="diff__grid">
            {[
              ['Local expertise', 'We live in Srinagar. We know when the tulips open, which roads close after snowfall, and where to find the best noon chai at dawn.'],
              ['Built around you', 'No fixed packages pushed at you. Tell us your dates, your people and what you love, and we shape the trip from there.'],
              ['Tours, stays and experiences', 'One team for the whole journey: the route and drives, the houseboat or lodge, and the moments in between.'],
              ['Recognised', 'KashWay Tour & Travels is recognised by the Jammu & Kashmir Tourism Department.'],
            ].map(([h, p], i) => (
              <Reveal key={h} delay={i * 0.08} className="diff__item">
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="diff__cta">
            <button type="button" className="btn btn--primary" onClick={() => open()}>Plan your trip <Arrow /></button>
            <a href={BRAND.instagram} className="link-arrow" target="_blank" rel="noopener noreferrer"><Instagram /> {BRAND.instagramHandle}</a>
          </div>
        </div>
      </section>

      <section id="credits" className="section--tight credits" aria-labelledby="credits-h">
        <div className="wrap">
          <h2 id="credits-h" className="h-sm">Photo credits</h2>
          <p className="muted">Photographs supplied by KashWay. Contour illustrations stand in wherever we don’t have a photograph yet. If you are a photographer and see your work here uncredited, please <Link to="/plan">get in touch</Link> and we will credit or remove it.</p>
          <ul role="list" className="credits__list">
            {Object.entries(PHOTOS).map(([k, p]) => <li key={k}>{p.caption}</li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
