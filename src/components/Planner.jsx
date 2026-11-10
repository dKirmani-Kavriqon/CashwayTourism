import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Picture from './Picture.jsx';
import Topo from './Topo.jsx';
import { Arrow, Close, Plus, Minus, Check, WhatsApp, Instagram } from './Icons.jsx';
import { DESTINATIONS, DEST_BY_SLUG, PLANNER_INTERESTS } from '../data/content.js';
import { BRAND, WHATSAPP_NUMBER, WHATSAPP_LINK, ENQUIRY_EMAIL, FORM_ENDPOINT } from '../config.js';
import { EASE } from '../lib/motion.jsx';

/* --------------------------------------------------------------------------
   Trip planner: tap a place, then answer one question per screen.
   The sheet can be opened from anywhere through usePlanner().open(slug).
   -------------------------------------------------------------------------- */

const PlannerCtx = createContext({ open: () => {} });
export const usePlanner = () => useContext(PlannerCtx);

const STORAGE_KEY = 'kashway-planner-draft';
const EMPTY = {
  places: [], arrange: [], month: '', from: '', to: '', length: '',
  adults: 2, children: 0, interests: [], callDay: '', callSlot: '',
  name: '', code: '+91', phone: '', email: '', note: '',
};

const CODES = [
  ['+91', 'India'], ['+971', 'UAE'], ['+966', 'Saudi Arabia'], ['+974', 'Qatar'], ['+965', 'Kuwait'],
  ['+968', 'Oman'], ['+973', 'Bahrain'], ['+44', 'United Kingdom'], ['+1', 'USA / Canada'],
  ['+61', 'Australia'], ['+65', 'Singapore'], ['+60', 'Malaysia'], ['+49', 'Germany'], ['+33', 'France'],
];

const ARRANGE = [
  { id: 'tour', label: 'A full tour', hint: 'Route, stays, drives and guides, planned end to end' },
  { id: 'stay', label: 'Stays', hint: 'Houseboats, hotels or homestays' },
  { id: 'experiences', label: 'Experiences', hint: 'Shikara mornings, gondola, treks, food and crafts' },
  { id: 'unsure', label: 'Not sure yet', hint: 'Talk it through with us' },
];
const LENGTHS = ['2–3 nights', '4–5 nights', '6–7 nights', '8 nights or more', 'Not sure yet'];
const SLOTS = [
  { id: 'morning', label: 'Morning', hint: '10am – 12pm' },
  { id: 'afternoon', label: 'Afternoon', hint: '2pm – 4pm' },
  { id: 'evening', label: 'Evening', hint: '6pm – 8pm' },
];

function nextMonths(n = 12) {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < n; i++) {
    out.push(d.toLocaleString('en-GB', { month: 'long', year: 'numeric' }));
    d.setMonth(d.getMonth() + 1);
  }
  return out;
}
function nextDays(n = 7) {
  const out = [];
  const d = new Date();
  for (let i = 1; i <= n; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    out.push({
      id: x.toISOString().slice(0, 10),
      top: x.toLocaleString('en-GB', { weekday: 'short' }),
      day: x.getDate(),
      mon: x.toLocaleString('en-GB', { month: 'short' }),
      full: x.toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
    });
  }
  return out;
}

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const phoneDigits = (v) => v.replace(/\D/g, '');
const phoneOk = (v) => phoneDigits(v).length >= 6 && phoneDigits(v).length <= 14;

function summary(d) {
  const places = d.places.map((s) => (s === 'help' ? 'Help me choose' : DEST_BY_SLUG[s]?.name)).join(', ');
  const arrange = d.arrange.map((a) => ARRANGE.find((x) => x.id === a)?.label).join(', ');
  const when = d.from ? `${d.from}${d.to ? ' to ' + d.to : ''}` : d.month || 'Flexible';
  const who = `${d.adults} adult${d.adults === 1 ? '' : 's'}${d.children ? `, ${d.children} child${d.children === 1 ? '' : 'ren'}` : ''}`;
  const call = d.callDay === 'none' ? 'No call, message me'
    : d.callDay ? `${nextDays().find((x) => x.id === d.callDay)?.full || d.callDay}, ${(() => { const sl = SLOTS.find((s) => s.id === d.callSlot); return sl ? `${sl.label.toLowerCase()} ${sl.hint}` : ''; })()} IST` : '';
  return [
    ['Places', places], ['Arrange', arrange], ['When', when], ['Length', d.length], ['Travellers', who],
    ['Interests', d.interests.join(', ')], ['Call', call], ['Name', d.name.trim()],
    ['Phone', `${d.code} ${d.phone.trim()}`], ['Email', d.email.trim()], ['Note', d.note.trim()],
  ].filter(([, v]) => v);
}
const HAS_WHATSAPP = !!(WHATSAPP_NUMBER || WHATSAPP_LINK);

/** Copies text inside the click itself, so it still works when a new tab or
 *  the WhatsApp app takes focus straight afterwards. Returns true on success. */
function copyNow(text) {
  let ok = false;
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select(); ta.setSelectionRange(0, text.length);
    ok = document.execCommand('copy');
    document.body.removeChild(ta);
  } catch { /* fall through */ }
  try { navigator.clipboard?.writeText(text).catch(() => {}); ok = ok || !!navigator.clipboard; } catch { /* blocked */ }
  return ok;
}

function messageText(d) {
  return ['Hello KashWay, I’d like to plan a trip to Kashmir.', '', ...summary(d).map(([k, v]) => `${k}: ${v}`), '', 'Sent from kashwaytours.com'].join('\n');
}

/* ----------------------------- Steps ------------------------------------ */
function useSteps(d) {
  return useMemo(() => [
    { id: 'where', q: 'Where do you want to wake up?', help: 'Pick one or more. You can change this later.', valid: d.places.length > 0 },
    { id: 'arrange', q: 'What should we arrange?', help: 'Choose all that apply.', valid: d.arrange.length > 0 },
    { id: 'when', q: 'When are you thinking of coming?', help: 'A month is enough. Add exact dates if you have them.', valid: !!(d.month || d.from) },
    { id: 'length', q: 'How long would you like to stay?', valid: !!d.length },
    { id: 'who', q: 'Who’s coming?', valid: d.adults >= 1 },
    { id: 'interests', q: 'What do you love doing?', help: 'Optional. It helps us shape the days.', valid: true, optional: true },
    { id: 'call', q: 'When can we call you?', help: 'Book a short call to plan it together. Times are India time (IST).', valid: d.callDay === 'none' || !!(d.callDay && d.callSlot) },
    { id: 'name', q: 'What’s your name?', valid: d.name.trim().length >= 2 },
    { id: 'phone', q: 'Your phone number?', help: 'We’ll reply on WhatsApp or call at your chosen time.', valid: phoneOk(d.phone) },
    { id: 'email', q: 'And your email?', help: 'Optional, for the written plan.', valid: !d.email.trim() || emailOk(d.email), optional: true },
    { id: 'note', q: 'Anything else we should know?', help: 'Optional. Occasions, dietary needs, mobility, must-sees.', valid: true, optional: true },
    { id: 'review', q: 'Here’s your trip.', help: WHATSAPP_NUMBER || !WHATSAPP_LINK ? 'Check the details, then send them to us.' : 'Check the details. When you tap Send on WhatsApp we copy them for you, so you only need to paste and send.', valid: true },
  ], [d]);
}

/* ----------------------------- Provider --------------------------------- */
export function PlannerProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const [data, setData] = useState(() => {
    try { return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') }; } catch { return EMPTY; }
  });
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState({ state: 'idle' });
  const lastFocus = useRef(null);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ }
  }, [data]);

  const open = useCallback((slug) => {
    lastFocus.current = document.activeElement;
    setStatus({ state: 'idle' });
    if (slug) {
      setData((d) => ({ ...d, places: d.places.includes(slug) ? d.places : [...d.places.filter((p) => p !== 'help'), slug] }));
      setStep(1);
    } else {
      setStep(0);
    }
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => lastFocus.current?.focus?.(), 50);
  }, []);
  const reset = useCallback(() => { setData(EMPTY); setStep(0); setStatus({ state: 'idle' }); }, []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);
  return (
    <PlannerCtx.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <PlannerSheet key="sheet" data={data} setData={setData} step={step} setStep={setStep}
            status={status} setStatus={setStatus} onClose={close} onReset={reset} />
        )}
      </AnimatePresence>
    </PlannerCtx.Provider>
  );
}

/* ----------------------------- Tiles (entry point) ---------------------- */
export function PlaceTiles({ compact = false }) {
  const { open } = usePlanner();
  return (
    <ul role="list" className={`tiles ${compact ? 'tiles--compact' : ''}`}>
      {DESTINATIONS.map((d) => (
        <li key={d.slug}>
          <button type="button" className="tile" onClick={() => open(d.slug)}>
            {d.image ? (
              <Picture name={d.image} sizes="(min-width: 900px) 22vw, 50vw" className="tile__img" alt="" />
            ) : (
              <Topo seed={d.slug} accent={d.accent} className="tile__img" rings={12} />
            )}
            <span className="tile__shade" />
            <span className="tile__text">
              <span className="tile__name">{d.name}</span>
              <span className="tile__meta">{d.meaning}</span>
            </span>
            <span className="tile__go" aria-hidden="true"><Arrow /></span>
          </button>
        </li>
      ))}
      <li>
        <button type="button" className="tile tile--help" onClick={() => open('help')}>
          <span className="tile__text">
            <span className="tile__name">Not sure yet?</span>
            <span className="tile__meta">Tell us what you love and we’ll suggest the places</span>
          </span>
          <span className="tile__go" aria-hidden="true"><Arrow /></span>
        </button>
      </li>
    </ul>
  );
}

/* ----------------------------- Sheet ------------------------------------ */
function PlannerSheet({ data, setData, step, setStep, status, setStatus, onClose, onReset }) {
  const steps = useSteps(data);
  const cur = steps[step];
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(1);
  const [touched, setTouched] = useState(false);
  const headingRef = useRef(null);
  const sheetRef = useRef(null);
  const advanceTimer = useRef();

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key, val) => setData((d) => ({ ...d, [key]: d[key].includes(val) ? d[key].filter((x) => x !== val) : [...d[key], val] }));

  const go = useCallback((i) => {
    clearTimeout(advanceTimer.current);
    setDir(i > step ? 1 : -1);
    setTouched(false);
    setStep(Math.max(0, Math.min(steps.length - 1, i)));
  }, [step, steps.length, setStep]);
  const next = () => { if (!cur.valid) { setTouched(true); return; } go(step + 1); };
  const autoNext = () => { clearTimeout(advanceTimer.current); advanceTimer.current = setTimeout(() => go(step + 1), reduce ? 0 : 320); };

  // Lock page scroll, close on Escape, keep focus inside.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && sheetRef.current) {
        const f = sheetRef.current.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { document.documentElement.style.overflow = prev; window.removeEventListener('keydown', onKey); clearTimeout(advanceTimer.current); };
  }, [onClose]);

  // Move focus to the new question (or its input) once it has finished entering.
  const focusStep = (def) => {
    if (def && def.opacity !== 1) return;
    const input = sheetRef.current?.querySelector('.step [data-autofocus]');
    (input || headingRef.current)?.focus({ preventScroll: true });
  };

  const firstPlace = data.places.find((p) => p !== 'help');
  const dest = firstPlace && DEST_BY_SLUG[firstPlace];
  const progress = status.state === 'done' ? 1 : (step + 1) / steps.length;

  /* --- sending --- */
  const msg = messageText(data);
  const sendWhatsApp = () => {
    if (WHATSAPP_NUMBER) {
      // With the number, WhatsApp opens with the whole enquiry already typed in.
      // It is also copied, as a backup for WhatsApp apps that drop the text.
      copyNow(msg);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      setStatus({ state: 'done', via: 'whatsapp', prefilled: true });
      return;
    }
    // The business chat link can't carry text, so copy the enquiry first,
    // in the same tap, then open the chat for the traveller to paste it.
    const copied = copyNow(msg);
    window.open(WHATSAPP_LINK, '_blank', 'noopener');
    setStatus({ state: 'done', via: 'whatsapp', prefilled: false, copied });
  };
  const sendInstagram = () => {
    const copied = copyNow(msg);
    window.open(BRAND.instagramDM, '_blank', 'noopener');
    setStatus({ state: 'done', via: 'instagram', copied });
  };
  const sendEmail = () => {
    window.location.href = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent('Trip enquiry from ' + data.name.trim())}&body=${encodeURIComponent(msg)}`;
    setStatus({ state: 'done', via: 'email' });
  };
  const sendForm = async () => {
    setStatus({ state: 'sending' });
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(summary(data)), message: msg, source: 'kashwaytours.com trip planner' }),
      });
      if (!res.ok) throw new Error(`The server answered ${res.status}.`);
      setStatus({ state: 'done', via: 'form' });
    } catch (e) {
      setStatus({ state: 'error', message: e.message || 'The connection failed.' });
    }
  };
  const copy = () => { if (copyNow(msg)) setStatus((s) => ({ ...s, copiedNow: true })); };

  const onEnter = (e) => { if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); next(); } };
  const months = useMemo(() => nextMonths(12), []);
  const days = useMemo(() => nextDays(7), []);

  return (
    <motion.div className="sheet" role="presentation"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <div className="sheet__backdrop" onClick={onClose} />
      <motion.div
        ref={sheetRef}
        className="sheet__panel"
        role="dialog" aria-modal="true" aria-labelledby="planner-q"
        initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <aside className="sheet__visual" aria-hidden="true">
          <AnimatePresence mode="popLayout">
            <motion.div key={dest?.slug || 'none'} className="sheet__visual-inner"
              initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE }}>
              {dest?.image ? <Picture name={dest.image} sizes="40vw" alt="" />
                : <Topo seed={dest?.slug || 'kashway'} accent={dest?.accent || '#a63e1d'} />}
            </motion.div>
          </AnimatePresence>
          <div className="sheet__visual-text">
            <span className="eyebrow eyebrow--plain">Your Kashmir</span>
            <span className="sheet__visual-name">
              {data.places.length ? data.places.map((p) => (p === 'help' ? 'Somewhere new' : DEST_BY_SLUG[p]?.name)).join(' · ') : 'Anywhere in the valley'}
            </span>
          </div>
        </aside>

        <div className="sheet__main">
          <header className="sheet__top">
            <div className="sheet__progress" role="progressbar" aria-label="Planner progress"
              aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={status.state === 'done' ? steps.length : step + 1}>
              <motion.span style={{ originX: 0 }} animate={{ scaleX: progress }} transition={{ duration: 0.6, ease: EASE }} />
            </div>
            <span className="sheet__count">{status.state === 'done' ? 'Done' : `${step + 1} of ${steps.length}`}</span>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close trip planner"><Close /></button>
          </header>

          <div className="sheet__body">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.section
                key={status.state === 'done' ? 'done' : cur.id}
                className="step"
                custom={dir}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, x: dir * -40, transition: { duration: 0.22, ease: 'easeIn' } }}
                transition={{ duration: 0.38, ease: EASE }}
                onKeyDown={onEnter}
                onAnimationComplete={focusStep}
              >
                {status.state === 'done' ? (
                  <Done status={status} data={data} onClose={onClose} onReset={onReset} copy={copy} headingRef={headingRef} retry={{ sendWhatsApp, sendInstagram }} />
                ) : (
                  <>
                    <h2 id="planner-q" className="step__q" tabIndex={-1} ref={headingRef}>{cur.q}</h2>
                    {cur.help && <p className="step__help">{cur.help}</p>}
                    <div className="step__field">
                      {cur.id === 'where' && (
                        <ul role="list" className="pick-grid">
                          {[...DESTINATIONS, { slug: 'help', name: 'Help me choose', meaning: 'We’ll suggest the places' }].map((d) => {
                            const on = data.places.includes(d.slug);
                            return (
                              <li key={d.slug}>
                                <button type="button" className="pick" aria-pressed={on}
                                  onClick={() => setData((x) => {
                                    if (d.slug === 'help') return { ...x, places: on ? [] : ['help'] };
                                    const rest = x.places.filter((p) => p !== 'help');
                                    return { ...x, places: on ? rest.filter((p) => p !== d.slug) : [...rest, d.slug] };
                                  })}>
                                  <span className="pick__label">{d.name}</span>
                                  <span className="pick__hint">{d.meaning}</span>
                                  <span className="pick__tick" aria-hidden="true"><Check /></span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {cur.id === 'arrange' && (
                        <ul role="list" className="pick-list">
                          {ARRANGE.map((a) => {
                            const on = data.arrange.includes(a.id);
                            return (
                              <li key={a.id}>
                                <button type="button" className="pick pick--row" aria-pressed={on}
                                  onClick={() => setData((x) => {
                                    if (a.id === 'unsure') return { ...x, arrange: on ? [] : ['unsure'] };
                                    const rest = x.arrange.filter((p) => p !== 'unsure');
                                    return { ...x, arrange: on ? rest.filter((p) => p !== a.id) : [...rest, a.id] };
                                  })}>
                                  <span className="pick__label">{a.label}</span>
                                  <span className="pick__hint">{a.hint}</span>
                                  <span className="pick__tick" aria-hidden="true"><Check /></span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {cur.id === 'when' && (
                        <>
                          <div className="chips" role="group" aria-label="Month">
                            {months.map((m) => (
                              <button key={m} type="button" className="chip" aria-pressed={data.month === m}
                                onClick={() => { set({ month: data.month === m ? '' : m }); if (data.month !== m && !data.from) autoNext(); }}>{m}</button>
                            ))}
                            <button type="button" className="chip" aria-pressed={data.month === 'Flexible'}
                              onClick={() => { set({ month: 'Flexible' }); autoNext(); }}>I’m flexible</button>
                          </div>
                          <details className="dates" open={!!data.from}>
                            <summary>I have exact dates</summary>
                            <div className="dates__row">
                              <label className="field">
                                <span>Arrive</span>
                                <input type="date" value={data.from} min={new Date().toISOString().slice(0, 10)}
                                  onChange={(e) => set({ from: e.target.value, to: data.to && data.to < e.target.value ? '' : data.to })} />
                              </label>
                              <label className="field">
                                <span>Leave</span>
                                <input type="date" value={data.to} min={data.from || new Date().toISOString().slice(0, 10)}
                                  onChange={(e) => set({ to: e.target.value })} />
                              </label>
                            </div>
                          </details>
                        </>
                      )}

                      {cur.id === 'length' && (
                        <ul role="list" className="pick-list">
                          {LENGTHS.map((l) => (
                            <li key={l}>
                              <button type="button" className="pick pick--row" aria-pressed={data.length === l}
                                onClick={() => { set({ length: l }); autoNext(); }}>
                                <span className="pick__label">{l}</span>
                                <span className="pick__tick" aria-hidden="true"><Check /></span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      {cur.id === 'who' && (
                        <div className="steppers">
                          <Stepper label="Adults" hint="12 years and over" value={data.adults} min={1} max={40} onChange={(v) => set({ adults: v })} />
                          <Stepper label="Children" hint="Under 12" value={data.children} min={0} max={20} onChange={(v) => set({ children: v })} />
                        </div>
                      )}

                      {cur.id === 'interests' && (
                        <div className="chips chips--lg" role="group" aria-label="Interests">
                          {PLANNER_INTERESTS.map((i) => (
                            <button key={i} type="button" className="chip" aria-pressed={data.interests.includes(i)} onClick={() => toggle('interests', i)}>{i}</button>
                          ))}
                        </div>
                      )}

                      {cur.id === 'call' && (
                        <>
                          <div className="days" role="group" aria-label="Day for the call">
                            {days.map((d) => (
                              <button key={d.id} type="button" className="day" aria-pressed={data.callDay === d.id} aria-label={d.full}
                                onClick={() => set({ callDay: d.id })}>
                                <span>{d.top}</span><strong>{d.day}</strong><span>{d.mon}</span>
                              </button>
                            ))}
                          </div>
                          <AnimatePresence>
                            {data.callDay && data.callDay !== 'none' && (
                              <motion.div className="slots" role="group" aria-label="Time for the call"
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                {SLOTS.map((s) => (
                                  <button key={s.id} type="button" className="pick pick--row" aria-pressed={data.callSlot === s.id}
                                    onClick={() => { set({ callSlot: s.id }); autoNext(); }}>
                                    <span className="pick__label">{s.label}</span>
                                    <span className="pick__hint">{s.hint} IST</span>
                                    <span className="pick__tick" aria-hidden="true"><Check /></span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <button type="button" className="chip chip--quiet" aria-pressed={data.callDay === 'none'}
                            onClick={() => { set({ callDay: 'none', callSlot: '' }); autoNext(); }}>
                            No call, just message me
                          </button>
                        </>
                      )}

                      {cur.id === 'name' && (
                        <label className="field field--xl">
                          <span className="sr-only">Your name</span>
                          <input data-autofocus type="text" autoComplete="name" placeholder="Full name" value={data.name}
                            onChange={(e) => set({ name: e.target.value })} aria-invalid={touched && !cur.valid} aria-describedby="err" />
                        </label>
                      )}

                      {cur.id === 'phone' && (
                        <div className="phone">
                          <label className="field">
                            <span className="sr-only">Country code</span>
                            <select value={data.code} onChange={(e) => set({ code: e.target.value })} autoComplete="tel-country-code">
                              {CODES.map(([c, n]) => <option key={c + n} value={c}>{c} {n}</option>)}
                              <option value="Other">Other (type it in)</option>
                            </select>
                          </label>
                          <label className="field field--xl">
                            <span className="sr-only">Phone number</span>
                            <input data-autofocus type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Phone number"
                              value={data.phone} onChange={(e) => set({ phone: e.target.value.replace(/[^\d\s+()-]/g, '') })}
                              aria-invalid={touched && !cur.valid} aria-describedby="err" />
                          </label>
                        </div>
                      )}

                      {cur.id === 'email' && (
                        <label className="field field--xl">
                          <span className="sr-only">Email address</span>
                          <input data-autofocus type="email" inputMode="email" autoComplete="email" placeholder="name@example.com"
                            value={data.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={touched && !cur.valid} aria-describedby="err" />
                        </label>
                      )}

                      {cur.id === 'note' && (
                        <label className="field">
                          <span className="sr-only">Anything else</span>
                          <textarea data-autofocus rows={5} maxLength={1000} placeholder="A honeymoon, a parent’s birthday, a vegetarian family…"
                            value={data.note} onChange={(e) => set({ note: e.target.value })} />
                        </label>
                      )}

                      {cur.id === 'review' && (
                        <>
                          <dl className="review">
                            {summary(data).map(([k, v]) => {
                              const target = { Places: 0, Arrange: 1, When: 2, Length: 3, Travellers: 4, Interests: 5, Call: 6, Name: 7, Phone: 8, Email: 9, Note: 10 }[k];
                              return (
                                <div key={k} className="review__row">
                                  <dt>{k}</dt><dd>{v}</dd>
                                  <button type="button" className="review__edit" onClick={() => go(target)} aria-label={`Change ${k.toLowerCase()}`}>Change</button>
                                </div>
                              );
                            })}
                          </dl>
                          {status.state === 'error' && (
                            <p className="form-error" role="alert">
                              We couldn’t send it: {status.message} Try again, or send it on {HAS_WHATSAPP ? 'WhatsApp' : 'Instagram'} below.
                            </p>
                          )}
                        </>
                      )}

                      <p id="err" className="field-error" aria-live="polite">
                        {touched && !cur.valid ? errorFor(cur.id) : ''}
                      </p>
                    </div>
                  </>
                )}
              </motion.section>
            </AnimatePresence>
          </div>

          {status.state !== 'done' && (
            <footer className="sheet__nav">
              <button type="button" className="btn" onClick={() => go(step - 1)} disabled={step === 0}>
                <Arrow dir="left" /> Back
              </button>
              {cur.id !== 'review' ? (
                <button type="button" className="btn btn--primary" onClick={next} aria-disabled={!cur.valid}>
                  {cur.optional && isBlank(cur.id, data) ? 'Skip' : 'Continue'} <Arrow />
                </button>
              ) : (
                          <div className="send send--bar">
                            {FORM_ENDPOINT && (
                              <button type="button" className="btn btn--primary" onClick={sendForm} disabled={status.state === 'sending'}>
                                {status.state === 'sending' ? 'Sending…' : 'Send enquiry'} <Arrow />
                              </button>
                            )}
                            {HAS_WHATSAPP ? (
                              <button type="button" className={`btn ${FORM_ENDPOINT ? '' : 'btn--primary'}`} onClick={sendWhatsApp}>
                                <WhatsApp /> Send on WhatsApp
                              </button>
                            ) : (
                              <button type="button" className={`btn ${FORM_ENDPOINT ? '' : 'btn--primary'}`} onClick={sendInstagram}>
                                <Instagram /> Copy and send on Instagram
                              </button>
                            )}
                            {ENQUIRY_EMAIL && <button type="button" className="btn" onClick={sendEmail}>Email instead</button>}
                          </div>
              )}
            </footer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function isBlank(id, d) {
  if (id === 'interests') return d.interests.length === 0;
  if (id === 'email') return !d.email.trim();
  if (id === 'note') return !d.note.trim();
  return false;
}
function errorFor(id) {
  return {
    where: 'Pick at least one place, or “Help me choose”.',
    arrange: 'Choose at least one option.',
    when: 'Pick a month, “I’m flexible”, or add your dates.',
    length: 'Choose a length of stay.',
    call: 'Pick a day and a time, or choose “No call”.',
    name: 'Please enter your name.',
    phone: 'Enter a phone number of 6 to 14 digits.',
    email: 'That email doesn’t look complete. Fix it or leave it empty.',
  }[id] || '';
}

function Stepper({ label, hint, value, min, max, onChange }) {
  return (
    <div className="stepper">
      <div>
        <span className="stepper__label">{label}</span>
        <span className="stepper__hint">{hint}</span>
      </div>
      <div className="stepper__ctl">
        <button type="button" className="icon-btn icon-btn--ring" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}><Minus /></button>
        <output aria-live="polite" aria-label={label}>{value}</output>
        <button type="button" className="icon-btn icon-btn--ring" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}><Plus /></button>
      </div>
    </div>
  );
}

function Done({ status, data, onClose, onReset, copy, headingRef, retry }) {
  const first = data.name.trim().split(' ')[0];
  const copy1 = {
    form: { h: `Thank you, ${first}.`, p: 'Your enquiry has reached KashWay. We’ll be in touch on your chosen channel' + (data.callDay && data.callDay !== 'none' ? ' and call you at the time you picked.' : '.') },
    whatsapp: { h: 'Almost there.', p: status.prefilled
      ? 'WhatsApp has opened with your trip details written out. Press send there and it reaches us directly.'
      : status.copied
        ? 'WhatsApp has opened a chat with KashWay and your trip details are copied. Paste them into the message box and press send.'
        : 'WhatsApp has opened a chat with KashWay. Copy your trip details with the button below, paste them into the message box and press send.' },
    instagram: { h: 'Almost there.', p: status.copied
      ? 'Your trip details are copied. Paste them into the Instagram chat that just opened and press send.'
      : 'Instagram has opened. Copy your trip details with the button below, paste them into the chat and press send.' },
    email: { h: 'Almost there.', p: 'Your email app has opened with the details filled in. Press send there to reach us.' },
  }[status.via];
  return (
    <div className="done">
      <span className="done__mark" aria-hidden="true"><Check size={22} /></span>
      <h2 className="step__q" tabIndex={-1} ref={headingRef} id="planner-q">{copy1.h}</h2>
      <p className="step__help">{copy1.p}</p>
      <div className="send">
        {status.via === 'whatsapp' && <button type="button" className="btn" onClick={retry.sendWhatsApp}><WhatsApp /> Open WhatsApp again</button>}
        {status.via === 'instagram' && <button type="button" className="btn" onClick={retry.sendInstagram}><Instagram /> Open Instagram again</button>}
        {status.via !== 'form' && <button type="button" className="btn" onClick={copy}>{status.copiedNow ? 'Copied' : 'Copy trip details'}</button>}
        <button type="button" className="btn btn--primary" onClick={() => { onReset(); onClose(); }}>Close</button>
      </div>
    </div>
  );
}
