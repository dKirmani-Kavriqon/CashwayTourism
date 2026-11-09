import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import { PlannerProvider } from './components/Planner.jsx';
import Intro from './components/Intro.jsx';
import Home from './pages/Home.jsx';
import { EASE } from './lib/motion.jsx';

const Destinations = lazy(() => import('./pages/Destinations.jsx'));
const Destination = lazy(() => import('./pages/Destination.jsx'));
const Experiences = lazy(() => import('./pages/Experiences.jsx'));
const Guides = lazy(() => import('./pages/Guides.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Plan = lazy(() => import('./pages/Plan.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function Page({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } }}
    >
      {children}
    </motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  const location = useLocation();
  // Scroll to an anchor if present, otherwise to the top, after each route change.
  const onExit = () => {
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; }, []);

  return (
    <PlannerProvider>
      <Intro />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Suspense fallback={<div className="page-loading" aria-live="polite"><span className="sr-only">Loading</span></div>}>
          <AnimatePresence mode="wait" onExitComplete={onExit}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Page><Home /></Page>} />
              <Route path="/destinations" element={<Page><Destinations /></Page>} />
              <Route path="/destinations/:slug" element={<Page><Destination /></Page>} />
              <Route path="/experiences" element={<Page><Experiences /></Page>} />
              <Route path="/guides" element={<Page><Guides /></Page>} />
              <Route path="/gallery" element={<Page><Gallery /></Page>} />
              <Route path="/about" element={<Page><About /></Page>} />
              <Route path="/plan" element={<Page><Plan /></Page>} />
              <Route path="*" element={<Page><NotFound /></Page>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </PlannerProvider>
  );
}
