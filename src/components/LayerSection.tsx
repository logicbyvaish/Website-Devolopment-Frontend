import { useState } from 'react'
import { BookOpenText, Building2 } from 'lucide-react'
import type { Layer } from '../lib/curriculum'
import Reveal from './Reveal'
import CodeBlock from './CodeBlock'
import Quiz from './Quiz'
import DomForge from './forges/DomForge'
import StyleForge from './forges/StyleForge'
import JsForge from './forges/JsForge'
import FrameworkForge from './forges/FrameworkForge'
import PerfForge from './forges/PerfForge'

export default function LayerSection({
  layer,
  onPass,
  passed,
  onOptimize,
}: {
  layer: Layer
  onPass: () => void
  passed: boolean
  onOptimize?: (v: number) => void
}) {
  const [tab, setTab] = useState(0)

  return (
    <section id={layer.id} aria-label={`Layer ${layer.num}: ${layer.name}`} className="relative min-h-screen py-28 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* header */}
        <Reveal>
          <p className="font-display text-[11px] tracking-[0.4em] mb-3" style={{ color: layer.color }}>
            LAYER {layer.num} // DEPTH {layer.num}0KM
          </p>
          <h2
            className="font-display extrude text-4xl sm:text-6xl lg:text-7xl leading-tight"
            style={{
              color: layer.color,
              ['--ex' as string]: `color-mix(in srgb, ${layer.color} 35%, #000)`,
              ['--gl' as string]: layer.glow,
            }}
          >
            {layer.name}
          </h2>
          <p className="font-display text-sm sm:text-base mt-3 text-ink/80">{layer.title}</p>
          <p className="mt-2 text-[13px] italic" style={{ color: layer.color }}>
            “{layer.tagline}”
          </p>
          <p className="mt-5 text-[13px] sm:text-[14px] leading-relaxed text-dim max-w-2xl">{layer.intro}</p>
        </Reveal>

        {/* concepts */}
        <Reveal delay={100} className="mt-12">
          <div className="flex gap-2 mb-4 flex-wrap">
            {layer.concepts.map((c, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: tab === i ? `color-mix(in srgb, ${layer.color} 18%, transparent)` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${tab === i ? layer.color : 'rgba(255,255,255,0.1)'}`,
                  color: tab === i ? layer.color : '#8b8ba3',
                }}
                aria-pressed={tab === i}
              >
                {String(i + 1).padStart(2, '0')} · {c.title}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <div className="glass rounded-lg p-5" style={{ borderLeft: `3px solid ${layer.color}` }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpenText size={14} style={{ color: layer.color }} />
                <h3 className="text-[13px] font-bold">{layer.concepts[tab].title}</h3>
              </div>
              <p className="text-[13px] leading-relaxed text-dim">{layer.concepts[tab].body}</p>
            </div>
            <CodeBlock code={layer.concepts[tab].code} color={layer.color} />
          </div>
        </Reveal>

        {/* interactive forge */}
        <Reveal delay={150} className="mt-12">
          <p className="font-display text-[11px] tracking-[0.3em] mb-4" style={{ color: layer.color }}>
            ▸ INTERACTIVE FORGE
          </p>
          {layer.forge === 'dom' && <DomForge />}
          {layer.forge === 'style' && <StyleForge />}
          {layer.forge === 'js' && <JsForge />}
          {layer.forge === 'framework' && <FrameworkForge />}
          {layer.forge === 'perf' && <PerfForge onOptimize={onOptimize ?? (() => {})} />}
        </Reveal>

        {/* case study */}
        <Reveal delay={200} className="mt-12">
          <div
            className="glass rounded-xl p-6 relative overflow-hidden"
            style={{ border: `1px solid ${layer.color}30` }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at top right, ${layer.glow}, transparent 60%)`, opacity: 0.35 }}
            />
            <div className="relative flex items-start gap-4">
              <div className="rounded-lg p-2.5 shrink-0" style={{ background: `color-mix(in srgb, ${layer.color} 15%, transparent)` }}>
                <Building2 size={18} style={{ color: layer.color }} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-dim mb-1">field report · {layer.caseStudy.company}</p>
                <p className="text-[13px] leading-relaxed">{layer.caseStudy.text}</p>
                <p className="mt-3 text-[12px] font-bold" style={{ color: layer.color }}>
                  ▸ {layer.caseStudy.stat}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* progress gate */}
        <Reveal delay={250} className="mt-12">
          <Quiz questions={layer.quiz} color={layer.color} onPass={onPass} passed={passed} />
        </Reveal>
      </div>
    </section>
  )
}
