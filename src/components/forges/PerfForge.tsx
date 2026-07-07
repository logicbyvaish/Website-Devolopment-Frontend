import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'

/**
 * Pedagogy: each optimization is a real technique with a real KB cost.
 * Toggling them shrinks the bundle bar AND the 3D city behind the panel —
 * performance you can see on the skyline.
 */
const OPTS = [
  { id: 'split', label: 'Code-split routes', kb: 180, tip: 'lazy(() => import(…))' },
  { id: 'img', label: 'Compress & resize images', kb: 220, tip: 'AVIF/WebP + srcset' },
  { id: 'shake', label: 'Tree-shake the utility lib', kb: 70, tip: "import { debounce } — not the whole lib" },
  { id: 'lazy', label: 'Lazy-load below-the-fold', kb: 90, tip: 'IntersectionObserver + dynamic import' },
  { id: 'gzip', label: 'Enable Brotli compression', kb: 130, tip: 'server-side, one config line' },
]
const BASE = 820

export default function PerfForge({ onOptimize }: { onOptimize: (v: number) => void }) {
  const [on, setOn] = useState<Set<string>>(new Set())
  const saved = useMemo(() => OPTS.filter((o) => on.has(o.id)).reduce((a, o) => a + o.kb, 0), [on])
  const size = BASE - saved
  const frac = saved / OPTS.reduce((a, o) => a + o.kb, 0)
  const lcp = (4.6 - frac * 3.0).toFixed(1)

  useEffect(() => onOptimize(frac), [frac, onOptimize])

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-4">
      <div className="glass rounded-lg p-5 space-y-2.5" style={{ borderLeft: '3px solid #7c3aed' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-dim mb-3">// shrink the city — apply real optimizations</p>
        {OPTS.map((o) => {
          const active = on.has(o.id)
          return (
            <button
              key={o.id}
              onClick={() => {
                const next = new Set(on)
                if (active) next.delete(o.id)
                else next.add(o.id)
                setOn(next)
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all"
              style={{
                background: active ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? '#7c3aed' : 'rgba(255,255,255,0.08)'}`,
              }}
              aria-pressed={active}
            >
              <span
                className="grid place-items-center w-5 h-5 rounded shrink-0"
                style={{ border: `1px solid ${active ? '#a78bfa' : 'rgba(255,255,255,0.2)'}`, background: active ? '#7c3aed' : 'transparent' }}
              >
                {active && <Check size={12} className="text-white" />}
              </span>
              <span className="flex-1">
                <span className="block text-[12px] font-bold" style={{ color: active ? '#e9d5ff' : '#c7c8dd' }}>{o.label}</span>
                <span className="block text-[10px] text-dim">{o.tip}</span>
              </span>
              <span className="text-[11px] font-bold shrink-0" style={{ color: active ? '#34d399' : '#8b8ba3' }}>
                −{o.kb}KB
              </span>
            </button>
          )
        })}
      </div>

      <div className="glass rounded-lg p-5 flex flex-col justify-center gap-5" style={{ borderLeft: '3px solid #7c3aed' }}>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-dim mb-1.5">bundle size</p>
          <p className="font-display text-2xl" style={{ color: size < 400 ? '#34d399' : size < 650 ? '#ffd60a' : '#f87171' }}>
            {size}KB
          </p>
          <div className="h-2 rounded-full bg-black/50 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(size / BASE) * 100}%`, background: 'linear-gradient(90deg,#34d399,#ffd60a,#f87171)' }}
            />
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-dim mb-1.5">estimated LCP</p>
          <p className="font-display text-2xl" style={{ color: +lcp <= 2.5 ? '#34d399' : '#f87171' }}>{lcp}s</p>
          <p className="text-[10px] text-dim mt-1">{+lcp <= 2.5 ? '✓ passing Core Web Vitals' : 'target: < 2.5s'}</p>
        </div>
        <p className="text-[10px] text-dim leading-relaxed">
          Look behind this panel — the 3D city skyline shrinks as you optimize.
        </p>
      </div>
    </div>
  )
}
