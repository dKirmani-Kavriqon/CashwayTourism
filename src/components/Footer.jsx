import { Link } from 'react-router-dom';
import { BRAND, WHATSAPP_NUMBER, ENQUIRY_EMAIL } from '../config.js';
import { DESTINATIONS } from '../data/content.js';
import { usePlanner } from './Planner.jsx';
import { Arrow, Instagram, WhatsApp } from './Icons.jsx';

const BASE = import.meta.env.BASE_URL;

export default function Footer() {
  const { open } = usePlanner();
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer__cta">
          <p className="footer__line">
            <em>Discover Kashmir,</em><br />the way it’s meant to be.
          </p>
          <button type="button" className="btn btn--primary" onClick={() => open()}>Start planning <Arrow /></button>
        </div>
        <hr className="rule" />
        <div className="footer__grid">
          <div className="footer__brand">
            <img src={`${BASE}logo-96.png`} width="56" height="56" alt="KashWay logo: a K with a chinar leaf and a shikara" />
            <p>{BRAND.legalName}<br /><span className="muted">{BRAND.recognition}</span></p>
          </div>
          <nav aria-label="Destinations">
            <h3 className="footer__h">Destinations</h3>
            <ul role="list">
              {DESTINATIONS.map((d) => <li key={d.slug}><Link to={`/destinations/${d.slug}`}>{d.name}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Explore">
            <h3 className="footer__h">Explore</h3>
            <ul role="list">
              <li><Link to="/experiences">Experiences</Link></li>
              <li><Link to="/guides">Travel guide</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/about">About KashWay</Link></li>
              <li><Link to="/plan">Plan a trip</Link></li>
            </ul>
          </nav>
          <div>
            <h3 className="footer__h">Talk to us</h3>
            <ul role="list">
              <li>{BRAND.city}</li>
              {WHATSAPP_NUMBER && <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"><WhatsApp size={16} /> WhatsApp</a></li>}
              {ENQUIRY_EMAIL && <li><a href={`mailto:${ENQUIRY_EMAIL}`}>{ENQUIRY_EMAIL}</a></li>}
              <li><a href={BRAND.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={16} /> {BRAND.instagramHandle}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span className="footer__mark wordmark" aria-hidden="true">Kashway</span>
          <p className="muted">© {new Date().getFullYear()} {BRAND.legalName}. <Link to="/about#credits">Photo credits</Link></p>
        </div>
      </div>
    </footer>
  );
}
