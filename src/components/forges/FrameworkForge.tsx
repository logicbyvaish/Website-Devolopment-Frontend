import { useRef, useState } from 'react'

/**
 * Pedagogy: a live component tree. Press the button (state change) and
 * ONLY the subtree that consumes that state glows — React reconciliation
 * made visible.
 */
function Comp({
  name,
  glow,
  children,
}: {
  name: string
  glow: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${glow ? 'branch-glow' : ''}`}
        style={{
          background: glow ? 'rgba(167,139,250,0.25)' : 'rgba(167,139,250,0.07)',
          border: `1px solid ${glow ? '#a78bfa' : 'rgba(167,139,250,0.3)'}`,
          color: glow ? '#e9d5ff' : '#a78bfa',
        }}
      >
        &lt;{name} /&gt;
      </div>
      {children && (
        <>
          <div className="w-px h-4" style={{ background: 'rgba(167,139,250,0.4)' }} />
          <div className="flex gap-4 pt-0 items-start">{children}</div>
        </>
      )}
    </div>
  )
}

export default function FrameworkForge() {
  const [count, setCount] = useState(0)
  const [glowKey, setGlowKey] = useState(0)
  const timer = useRef<number>(0)

  const bump = () => {
    setCount((c) => c + 1)
    setGlowKey((k) => k + 1)
    window.clearTimeout(timer.current)
  }

  return (
    <div className="grid md:grid-cols-[1fr_260px] gap-4">
      <div className="glass rounded-lg p-5 overflow-x-auto" style={{ borderLeft: '3px solid #a78bfa' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-dim mb-4">// component tree — watch what re-renders</p>
        <div key={glowKey} className="min-w-[380px] flex justify-center pb-2">
          <Comp name="App" glow={false}>
            <Comp name="Header" glow={false}>
              <Comp name="Logo" glow={false} />
              <Comp name="Nav" glow={false} />
            </Comp>
            <Comp name="Forge" glow={glowKey > 0}>
              <Comp name="Counter" glow={glowKey > 0} />
              <Comp name="Anvil" glow={glowKey > 0} />
            </Comp>
            <Comp name="Footer" glow={false} />
          </Comp>
        </div>
        <p className="text-[11px] text-dim mt-3">
          State lives in <span style={{ color: '#a78bfa' }}>&lt;Forge /&gt;</span> — so only its branch glows.{' '}
          <span className="text-ink">Header and Footer never re-render.</span>
        </p>
      </div>
      <div className="glass rounded-lg p-5 flex flex-col justify-center items-center gap-4" style={{ borderLeft: '3px solid #a78bfa' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-dim">the state</p>
        <p className="font-display text-4xl" style={{ color: '#e9d5ff', textShadow: '0 0 24px rgba(167,139,250,0.6)' }}>
          {count}
        </p>
        <button
          onClick={bump}
          className="px-4 py-2 rounded-lg text-[12px] font-bold transition-transform hover:scale-105 active:scale-95"
          style={{ background: 'rgba(167,139,250,0.18)', border: '1px solid #a78bfa', color: '#e9d5ff', boxShadow: '0 0 18px rgba(167,139,250,0.3)' }}
        >
          setCount(c =&gt; c + 1)
        </button>
        <code className="text-[10px] text-dim text-center">items forged: {count}</code>
      </div>
    </div>
  )
}
