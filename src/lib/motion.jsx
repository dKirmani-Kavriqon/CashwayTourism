import { Fragment, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];
export const EASE_FILM = [0.65, 0, 0.35, 1];

/** Fade-and-rise on first entering the viewport. */
export function Reveal({ as = 'div', delay = 0, y = 28, children, className, style, amount = 0.2, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.2 : 1, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Masked word-by-word reveal for headlines. `inView` waits for scroll; otherwise plays on mount. */
export function SplitWords({ text, as = 'span', className, delay = 0, stagger = 0.06, inView = false }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  const words = text.split(' ');
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.5 } }
    : { initial: 'hidden', animate: 'show' };
  return (
    <M className={className} {...trigger}
      variants={{ show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } } }}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split__mask" aria-hidden="true">
            <motion.span
              className="split__word"
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: '105%' },
                show: reduce ? { opacity: 1 } : { y: '0%', transition: { duration: 1.1, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </M>
  );
}

/** Image that unmasks upward (clip-path) when it scrolls into view.
 *  The observer sits on an unclipped wrapper so the clip never hides it from IntersectionObserver. */
export function ClipReveal({ children, className, delay = 0, style }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div
        className="clip-inner"
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={inView ? (reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }) : undefined}
        transition={{ duration: 1.4, ease: EASE_FILM, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
