import { Link } from 'react-router-dom';
import Topo from '../components/Topo.jsx';
import { Arrow } from '../components/Icons.jsx';
import useSeo from '../lib/useSeo.js';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page doesn’t exist. Find your way back to KashWay’s Kashmir destinations.', path: '/404' });
  return (
    <section className="nf wrap">
      <div className="nf__art" aria-hidden="true"><Topo seed="lost" rings={16} /></div>
      <div>
        <span className="eyebrow">Off the map</span>
        <h1 className="display">This path <em>leads nowhere.</em></h1>
        <p className="lede muted">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="nf__links">
          <Link to="/" className="btn btn--primary">Back to the start <Arrow /></Link>
          <Link to="/destinations" className="link-arrow">See destinations <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}
