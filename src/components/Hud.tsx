import { useState } from 'react'
import { ChevronUp, Gauge, Map, Settings2, X, Zap, ZapOff } from 'lucide-react'
import { LAYERS } from '../lib/curriculum'

const STOPS = [
  { id: 'hero', label: 'Launch', color: '#e8e8f2' },
  ...LAYERS.map((l) => ({ id: l.id, label: l.name, color: l.color })),
  { id: 'finale', label: 'Gauntlet', color: '#22d3ee' },
]

export function DotNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Layer navigation"
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4"
    >
      {STOPS.map((s) => {
        const isActive = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={`Jump to ${s.label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center"
          >
            <span
              className={`absolute right-5 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap glass transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              style={{ color: s.color }}
            >
              {s.label}
            </span>
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-all ${isActive ? 'dot-active scale-125' : ''}`}
              style={{
                background: isActive ? s.color : 'rgba(255,255,255,0.25)',
                ['--pc' as string]: `${s.color}99`,
              }}
            />
          </a>
        )
      })}
    </nav>
  )
}

export function ProgressHud({ progress, active }: { progress: number; active: string }) {
  const stop = STOPS.find((s) => s.id === active) ?? STOPS[0]
  return (
    <div className="fixed top-3 left-3 sm:top-5 sm:left-5 z-40 glass rounded-xl px-4 py-3 max-w-[220px]">
      <p className="font-display text-[10px] tracking-[0.25em] mb-1.5" style={{ color: stop.color }}>
        STACK://DIVE
      </p>
      <div className="h-1.5 rounded-full bg-black/50 overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg,#22d3ee,#ff2ec4,#ffd60a,#a78bfa,#7c3aed)',
          }}
        />
      </div>
      <p className="text-[10px] text-dim mt-1.5">
        depth {Math.round(progress * 100)}% · <span style={{ color: stop.color }}>{stop.label}</span>
      </p>
    </div>
  )
}

export function MiniMap({ active }: { active: string }) {
  return (
    <div className="fixed top-3 right-3 sm:top-5 sm:right-14 z-40 glass rounded-xl px-3 py-2.5 hidden md:flex items-center gap-2" aria-hidden="true">
      <Map size={12} className="text-dim" />
      <div className="flex items-center gap-1">
        {STOPS.map((s, i) => (
          <span key={s.id} className="flex items-center">
            <span
              className="w-4 h-4 grid place-items-center rounded text-[8px] font-bold transition-all"
              style={{
                background: active === s.id ? `${s.color}33` : 'transparent',
                border: `1px solid ${active === s.id ? s.color : 'rgba(255,255,255,0.12)'}`,
                color: active === s.id ? s.color : '#55566b',
              }}
            >
              {i}
            </span>
            {i < STOPS.length - 1 && <span className="w-1.5 h-px bg-white/15" />}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SettingsPanel({
  quality,
  setQuality,
  flat,
  setFlat,
}: {
  quality: 'high' | 'low'
  setQuality: (q: 'high' | 'low') => void
  flat: boolean
  setFlat: (b: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="glass rounded-xl p-4 w-56 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-dim">render quality</span>
            <button
              onClick={() => setQuality(quality === 'high' ? 'low' : 'high')}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold"
              style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee' }}
            >
              {quality === 'high' ? <Zap size={11} /> : <ZapOff size={11} />}
              {quality}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-dim">2D fallback</span>
            <button
              onClick={() => setFlat(!flat)}
              role="switch"
              aria-checked={flat}
              className="relative w-9 h-5 rounded-full transition-colors"
              style={{ background: flat ? '#22d3ee' : 'rgba(255,255,255,0.15)' }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: flat ? 18 : 2 }}
              />
            </button>
          </div>
          <p className="text-[10px] text-dim leading-relaxed">
            2D mode swaps the WebGL dimension for a lightweight gradient field. All lessons stay fully playable.
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Settings"
        aria-expanded={open}
        className="glass rounded-full p-3 hover:bg-white/10 transition-colors"
      >
        {open ? <X size={16} /> : <Settings2 size={16} />}
      </button>
      <div className="glass rounded-full px-2.5 py-1 flex items-center gap-1.5" aria-hidden="true">
        <Gauge size={10} className="text-dim" />
        <Fps />
      </div>
    </div>
  )
}

import { useEffect, useState as useSt } from 'react'
function Fps() {
  const [fps, setFps] = useSt(60)
  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const loop = () => {
      frames++
      const now = performance.now()
      if (now - last >= 1000) {
        setFps(frames)
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <span className="text-[10px] font-bold" style={{ color: fps >= 50 ? '#34d399' : fps >= 30 ? '#ffd60a' : '#f87171' }}>
      {fps}fps
    </span>
  )
}

export function Terminal() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>([
    'stack://dive terminal v1.0',
    "type 'help' for commands",
  ])

  const run = () => {
    const cmd = input.trim()
    if (!cmd) return
    const out = [...lines, `> ${cmd}`]
    const c = cmd.toLowerCase()
    if (c === 'help') out.push('commands: help · layers · whoami · stack · clear · goto <layer>')
    else if (c === 'layers') out.push('html · css · js · frameworks · advanced · finale')
    else if (c === 'whoami') out.push('guild-member: stack diver (apprentice tier)')
    else if (c === 'stack') out.push('three.js · react · tailwind v4 · vite · raw scroll physics')
    else if (c === 'clear') {
      setLines([])
      setInput('')
      return
    } else if (c.startsWith('goto ')) {
      const id = c.slice(5).trim()
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        out.push(`warping to ${id}…`)
      } else out.push(`unknown layer: ${id}`)
    } else out.push(`command not found: ${cmd} — try 'help'`)
    setLines(out.slice(-14))
    setInput('')
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-3">
      {open && (
        <div className="glass rounded-t-xl p-4 text-[12px] max-h-56 overflow-y-auto" style={{ borderBottom: 'none' }}>
          {lines.map((l, i) => (
            <p key={i} className={l.startsWith('>') ? 'text-cyan-300' : 'text-dim'}>
              {l}
            </p>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span style={{ color: '#22d3ee' }}>❯</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && run()}
              className="flex-1 bg-transparent outline-none text-ink"
              placeholder="help"
              aria-label="Terminal command input"
              autoFocus
            />
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mx-auto flex items-center gap-2 glass rounded-t-lg px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-dim hover:text-ink transition-colors"
        style={{ borderBottom: 'none' }}
      >
        <ChevronUp size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        terminal
      </button>
    </div>
  )
}
