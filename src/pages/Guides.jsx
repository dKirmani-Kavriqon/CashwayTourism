import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal, SplitWords } from '../lib/motion.jsx';
import { GUIDES, FAQS } from '../data/guides.js';
import { DESTINATIONS } from '../data/content.js';
import { Arrow, Plus } from '../components/Icons.jsx';
import Picture from '../components/Picture.jsx';
import useSeo from '../lib/useSeo.js';

export default function Guides() {
  useSeo({
    title: 'Kashmir travel guide',
    description: 'When to visit Kashmir, how to get there and get around, local customs, what to pack, phones and money, and answers to common questions.',
    path: '/guides',
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  });
  const [active, setActive] = useState(GUIDES[0].id);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    [...GUIDES.map((g) => g.id), 'faq'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header className="phead phead--guide">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">The KashWay travel guide</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="Before" /> <em><SplitWords text="you go." delay={0.15} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}>
            <p>Seasons, routes, customs and the small practical things. Everything we tell friends before they visit.</p>
          </Reveal>
        </div>
      </header>

      <div className="wrap guide">
        <nav className="guide__toc" aria-label="Chapters">
          <ol role="list">
            {GUIDES.map((g) => (
              <li key={g.id}><a href={`#${g.id}`} aria-current={active === g.id ? 'true' : undefined}>{g.title}</a></li>
            ))}
            <li><a href="#faq" aria-current={active === 'faq' ? 'true' : undefined}>Questions</a></li>
          </ol>
        </nav>

        <div className="guide__body">
          {GUIDES.map((g, gi) => (
            <section key={g.id} id={g.id} className="chapter" aria-labelledby={`${g.id}-h`}>
              <span className="eyebrow">{g.kicker}</span>
              <h2 id={`${g.id}-h`}>{g.title}</h2>
              <p className="lede chapter__intro">{g.intro}</p>
              <div className="chapter__blocks">
                {g.blocks.map((b) => (
                  <Reveal key={b.h} className="chapter__block">
                    <h3>{b.h}</h3>
                    <p>{b.p}</p>
                  </Reveal>
                ))}
              </div>
              {gi === 0 && (
                <figure className="chapter__fig">
                  <Picture name="dal-autumn" sizes="(min-width: 900px) 40vw, 100vw" />
                  <figcaption className="cap">Autumn on Dal Lake, Srinagar. The chinars turn from late October.</figcaption>
                </figure>
              )}
            </section>
          ))}

          <section id="faq" className="chapter" aria-labelledby="faq-h">
            <span className="eyebrow">Questions</span>
            <h2 id="faq-h">Frequently asked</h2>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q} className="faq__item">
                  <summary><span>{f.q}</span><Plus /></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="chapter guide__next">
            <h2 className="h-sm">Destination guides</h2>
            <ul role="list" className="guide__dest">
              {DESTINATIONS.map((d) => (
                <li key={d.slug}><Link to={`/destinations/${d.slug}`} className="link-arrow">{d.name} <Arrow /></Link></li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
