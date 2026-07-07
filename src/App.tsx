import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Github, Rocket } from 'lucide-react'
import { LAYERS } from './lib/curriculum'
import { StackScene } from './lib/scene'
import LayerSection from './components/LayerSection'
import Gauntlet from './components/Gauntlet'
import Reveal from './components/Reveal'
import { DotNav, MiniMap, ProgressHud, SettingsPanel, Terminal } from './components/Hud'
import { burstConfetti } from './lib/confetti'

/**
 * STACK://DIVE — a 3D spatial journey through the web stack.
 * The WebGL "dimension" (fixed canvas) flies backwards through themed
 * zones while the 2D lesson content scrolls over it. Progress = scroll.
 */

const SECTION_IDS = ['hero', ...LAYERS.map((l) => l.id), 'finale']

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<StackScene | null>(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('hero')
  const [quality, setQuality] = useState<'high' | 'low'>('high')
  const [flat, setFlat] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [passed, setPassed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('stackdive-passed') ?? '[]'))
    } catch {
      return new Set()
    }
  })

  // mobile → default to 2D fallback + 3D hero handled via quality
  useEffect(() => {
    if (window.innerWidth < 640) setQuality('low')
    // WebGL support check
    try {
      const c = document.createElement('canvas')
      if (!c.getContext('webgl2') && !c.getContext('webgl')) {
        setWebglOk(false)
        setFlat(true)
      }
    } catch {
      setWebglOk(false)
      setFlat(true)
    }
  }, [])

  // init 3D scene (error boundary via try/catch)
  useEffect(() => {
    if (flat || !webglOk || !canvasRef.current) {
      setLoaded(true)
      return
    }
    try {
      const scene = new StackScene(canvasRef.current)
      sceneRef.current = scene
      scene.setQuality(quality)
      const t = setTimeout(() => setLoaded(true), 400)
      return () => {
        clearTimeout(t)
        scene.dispose()
        sceneRef.current = null
      }
    } catch (e) {
      console.error('3D init failed, falling back to 2D:', e)
      setWebglOk(false)
      setFlat(true)
      setLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat, webglOk])

  useEffect(() => {
    sceneRef.current?.setQuality(quality)
  }, [quality])

  // scroll → progress + active section
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      setProgress(p)
      sceneRef.current?.setProgress(p)

      // active section: closest section top above midpoint
      let current = 'hero'
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const markPassed = useCallback((id: string) => {
    setPassed((prev) => {
      const next = new Set(prev).add(id)
      localStorage.setItem('stackdive-passed', JSON.stringify([...next]))
      return next
    })
  }, [])

  const onOptimize = useCallback((v: number) => {
    sceneRef.current?.setCityOptimization(v)
  }, [])

  return (
    <div className="relative">
      {/* loading veil */}
      {!loaded && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-void">
          <div className="text-center">
            <p className="font-display text-lg tracking-[0.3em] cursor-blink" style={{ color: '#22d3ee' }}>
              COMPILING DIMENSION
            </p>
            <p className="text-[11px] text-dim mt-2">spinning up the void…</p>
          </div>
        </div>
      )}

      {/* the 3D dimension OR 2D fallback field */}
      {!flat && webglOk ? (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 -z-10"
          aria-hidden="true"
          role="presentation"
        />
      ) : (
        <div
          className="fixed inset-0 -z-10"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 20% 10%, rgba(34,211,238,0.10), transparent),
              radial-gradient(ellipse 50% 40% at 80% 35%, rgba(255,46,196,0.09), transparent),
              radial-gradient(ellipse 55% 40% at 25% 60%, rgba(255,214,10,0.07), transparent),
              radial-gradient(ellipse 60% 45% at 75% 90%, rgba(124,58,237,0.12), transparent),
              #0a0a0f`,
          }}
        >
          {/* subtle SVG grid for the 2D fallback */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]" aria-hidden="true">
            <defs>
              <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="#22d3ee" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>
      )}

      {/* vignette to keep text legible over 3D */}
      <div
        className="fixed inset-0 -z-[5] pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,10,15,0.55) 100%)' }}
      />

      {/* HUD */}
      <ProgressHud progress={progress} active={active} />
      <DotNav active={active} />
      <MiniMap active={active} />
      <SettingsPanel quality={quality} setQuality={setQuality} flat={flat} setFlat={setFlat} />
      <Terminal />

      {/* ================= HERO ================= */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <Reveal>
            <p className="font-display text-[11px] tracking-[0.5em] text-dim mb-6">
              A GUILD INITIATION · NOT A SYLLABUS
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1
              className="font-display extrude text-5xl sm:text-7xl lg:text-8xl leading-none"
              style={{
                color: '#e8e8f2',
                ['--ex' as string]: '#232338',
                ['--gl' as string]: 'rgba(34,211,238,0.35)',
              }}
            >
              STACK
              <span className="block mt-2" style={{ color: '#22d3ee', ['--ex' as string]: '#0e7490' }}>
                ://DIVE
              </span>
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <p className="mt-8 text-[14px] sm:text-base leading-relaxed text-dim max-w-xl mx-auto">
              You're not here to study web development.{' '}
              <span className="text-ink">You're here to build the digital world.</span> Scroll to
              descend through five layers of the stack — from raw HTML bones to an optimized
              metropolis. Every concept is a place. Every lesson is a forge.
            </p>
          </Reveal>
          <Reveal delay={380}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#html"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-display text-[12px] tracking-widest transition-transform hover:scale-105"
                style={{
                  background: 'rgba(34,211,238,0.15)',
                  border: '1px solid #22d3ee',
                  color: '#22d3ee',
                  boxShadow: '0 0 30px rgba(34,211,238,0.3)',
                }}
              >
                <Rocket size={14} /> BEGIN THE DIVE
              </a>
              <div className="flex gap-1.5" aria-hidden="true">
                {LAYERS.map((l) => (
                  <span
                    key={l.id}
                    className="w-2 h-6 rounded-full"
                    style={{ background: l.color, opacity: passed.has(l.id) ? 1 : 0.25, boxShadow: passed.has(l.id) ? `0 0 10px ${l.color}` : 'none' }}
                    title={l.name}
                  />
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={500}>
            <div className="mt-16 flex flex-col items-center gap-1 text-dim">
              <span className="text-[10px] uppercase tracking-[0.3em]">scroll to descend</span>
              <ChevronDown size={18} className="animate-bounce" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= LAYERS ================= */}
      {LAYERS.map((layer) => (
        <LayerSection
          key={layer.id}
          layer={layer}
          passed={passed.has(layer.id)}
          onPass={() => markPassed(layer.id)}
          onOptimize={layer.forge === 'perf' ? onOptimize : undefined}
        />
      ))}

      {/* ================= FINALE ================= */}
      <section id="finale" aria-label="Full-Stack Gauntlet finale" className="relative min-h-screen flex items-center justify-center px-4 py-28">
        <div className="max-w-3xl mx-auto text-center w-full">
          <Reveal>
            <p className="font-display text-[11px] tracking-[0.4em] mb-3" style={{ color: '#22d3ee' }}>
              FINAL DEPTH // THE PORTAL
            </p>
            <h2
              className="font-display extrude text-4xl sm:text-6xl"
              style={{
                color: '#e8e8f2',
                ['--ex' as string]: '#232338',
                ['--gl' as string]: 'rgba(255,46,196,0.35)',
              }}
            >
              THE GAUNTLET
            </h2>
            <p className="mt-5 text-[13px] sm:text-[14px] text-dim max-w-xl mx-auto leading-relaxed">
              Five layers behind you. {passed.size}/{LAYERS.length} gates cleared. One trial remains:
              real bugs from every layer of the stack, on the clock. Pass through the portal and
              take your guild rank.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-10">
            <Gauntlet />
          </Reveal>
          <Reveal delay={250} className="mt-16">
            <div className="glass rounded-xl p-6 text-left max-w-lg mx-auto">
              <p className="font-display text-[11px] tracking-[0.3em] mb-3" style={{ color: '#ffd60a' }}>
                YOUR GUILD RECORD
              </p>
              <div className="space-y-2">
                {LAYERS.map((l) => (
                  <div key={l.id} className="flex items-center justify-between text-[12px]">
                    <span style={{ color: l.color }}>
                      {l.num} · {l.name}
                    </span>
                    <span className={passed.has(l.id) ? 'font-bold' : 'text-dim'} style={passed.has(l.id) ? { color: '#34d399' } : {}}>
                      {passed.has(l.id) ? '✓ FORGED' : '· unclaimed'}
                    </span>
                  </div>
                ))}
              </div>
              {passed.size === LAYERS.length && (
                <button
                  onClick={() => burstConfetti('#ffd60a', 40)}
                  className="mt-4 w-full py-2.5 rounded-lg font-display text-[11px] tracking-widest transition-transform hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(90deg, rgba(34,211,238,0.2), rgba(255,214,10,0.2))',
                    border: '1px solid rgba(255,214,10,0.5)',
                    color: '#ffd60a',
                  }}
                >
                  ★ ALL LAYERS FORGED — CLAIM YOUR CELEBRATION ★
                </button>
              )}
            </div>
          </Reveal>
          <Reveal delay={350} className="mt-16">
            <footer className="text-[11px] text-dim flex items-center justify-center gap-2">
              <Github size={12} />
              <span>
                Built with Three.js · React · Tailwind — practicing exactly what it preaches.
              </span>
            </footer>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
