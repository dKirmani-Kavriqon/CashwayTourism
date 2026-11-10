import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlaceTiles, usePlanner } from '../components/Planner.jsx';
import { Instagram, WhatsApp } from '../components/Icons.jsx';
import { Reveal, SplitWords } from '../lib/motion.jsx';
import { BRAND, WHATSAPP_CHAT, ENQUIRY_EMAIL } from '../config.js';
import { DEST_BY_SLUG } from '../data/content.js';
import useSeo from '../lib/useSeo.js';

export default function Plan() {
  useSeo({
    title: 'Plan your Kashmir trip',
    description: 'Tell KashWay where you want to go in Kashmir. Pick a place, answer a few quick questions, and book a call with our Srinagar team.',
    path: '/plan',
  });
  const [params] = useSearchParams();
  const { open } = usePlanner();
  useEffect(() => {
    const to = params.get('to');
    if (to && (DEST_BY_SLUG[to] || to === 'help')) open(to);
  }, [params, open]);

  return (
    <>
      <header className="phead phead--plan">
        <div className="wrap phead__grid">
          <div>
            <Reveal><span className="eyebrow">Plan your trip</span></Reveal>
            <h1 className="display phead__title"><SplitWords text="Where do you want" /> <em><SplitWords text="to wake up?" delay={0.2} /></em></h1>
          </div>
          <Reveal className="prose phead__lede" delay={0.3}>
            <p>Tap a place to begin. We’ll ask a few short questions, one at a time: dates, travellers, a time to call you, and how to reach you. It takes about a minute.</p>
          </Reveal>
        </div>
      </header>
      <section className="wrap plan-page" aria-label="Choose a destination">
        <PlaceTiles />
      </section>
      <section className="section--tight wrap contact" aria-labelledby="contact-h">
        <h2 id="contact-h" className="h-sm">Or reach us directly</h2>
        <ul role="list" className="contact__list">
          <li><span className="contact__k">Based in</span><span>{BRAND.city}</span></li>
          {WHATSAPP_CHAT && (
            <li><span className="contact__k">WhatsApp</span>
              <a href={WHATSAPP_CHAT} target="_blank" rel="noopener noreferrer" className="link-arrow"><WhatsApp /> Message us</a></li>
          )}
          {ENQUIRY_EMAIL && <li><span className="contact__k">Email</span><a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a></li>}
          <li><span className="contact__k">Instagram</span>
            <a href={BRAND.instagramDM} target="_blank" rel="noopener noreferrer" className="link-arrow"><Instagram /> Message {BRAND.instagramHandle}</a></li>
        </ul>
      </section>
    </>
  );
}
