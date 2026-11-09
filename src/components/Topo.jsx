import { useMemo } from 'react';

function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A contour-line "field plate": drawn art for places we don't yet have
 * a real photograph of. It is deliberately illustrative, never a fake photo.
 */
export default function Topo({ seed = 'kashway', accent = '#a63e1d', label, sub, className = '', rings = 15 }) {
  const paths = useMemo(() => {
    const r = rng(seed);
    const peaks = [0, 1].map(() => ({ x: 260 + (r() - 0.5) * 240, y: 330 + (r() - 0.5) * 260 }));
    const harmonics = Array.from({ length: 4 }, (_, i) => ({ a: 0.06 + r() * 0.1 / (i + 1), f: i + 2, p: r() * Math.PI * 2 }));
    const out = [];
    peaks.forEach((pk, pi) => {
      const n = pi === 0 ? rings : Math.round(rings * 0.55);
      for (let k = 1; k <= n; k++) {
        const base = k * (pi === 0 ? 24 : 20);
        let d = '';
        for (let s = 0; s <= 96; s++) {
          const t = (s / 96) * Math.PI * 2;
          const wob = harmonics.reduce((acc, h) => acc + h.a * Math.sin(h.f * t + h.p + k * 0.18), 0);
          const rad = base * (1 + wob);
          const x = pk.x + Math.cos(t) * rad * 1.15;
          const y = pk.y + Math.sin(t) * rad;
          d += `${s ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        out.push({ d: d + 'Z', strong: k % 5 === 0 });
      }
    });
    return out;
  }, [seed, rings]);

  return (
    <div className={`topo ${className}`} style={{ '--topo-accent': accent }}>
      <svg viewBox="0 0 520 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="520" height="660" className="topo__bg" />
        {paths.map((p, i) => (
          <path key={i} d={p.d} className={p.strong ? 'topo__line topo__line--strong' : 'topo__line'} />
        ))}
      </svg>
      {(label || sub) && (
        <div className="topo__label">
          {label && <span className="topo__name">{label}</span>}
          {sub && <span className="topo__sub">{sub}</span>}
        </div>
      )}
    </div>
  );
}
