import { useState } from 'react'

/**
 * Pedagogy: sliders map 1:1 to box-model properties. Learners FEEL
 * padding vs margin by dragging, and the generated CSS updates live.
 */
export default function StyleForge() {
  const [padding, setPadding] = useState(20)
  const [margin, setMargin] = useState(16)
  const [border, setBorder] = useState(3)
  const [radius, setRadius] = useState(12)
  const [gap, setGap] = useState(12)
  const [justify, setJustify] = useState<'flex-start' | 'center' | 'space-between'>('center')

  const Slider = ({
    label,
    value,
    set,
    max,
  }: {
    label: string
    value: number
    set: (n: number) => void
    max: number
  }) => (
    <label className="block">
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-dim uppercase tracking-wider">{label}</span>
        <span className="font-bold" style={{ color: '#ff2ec4' }}>{value}px</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="w-full accent-pink-500"
        aria-label={`${label} slider`}
      />
    </label>
  )

  const css = `.box {\n  padding: ${padding}px;\n  margin: ${margin}px;\n  border: ${border}px solid #ff2ec4;\n  border-radius: ${radius}px;\n}\n.row {\n  display: flex;\n  justify-content: ${justify};\n  gap: ${gap}px;\n}`

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-4">
      <div className="glass rounded-lg p-4 space-y-3" style={{ borderLeft: '3px solid #ff2ec4' }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-dim">// style forge</p>
        <Slider label="padding" value={padding} set={setPadding} max={48} />
        <Slider label="margin" value={margin} set={setMargin} max={48} />
        <Slider label="border" value={border} set={setBorder} max={12} />
        <Slider label="radius" value={radius} set={setRadius} max={40} />
        <Slider label="flex gap" value={gap} set={setGap} max={40} />
        <div>
          <p className="text-[11px] text-dim uppercase tracking-wider mb-1.5">justify-content</p>
          <div className="flex flex-wrap gap-1.5">
            {(['flex-start', 'center', 'space-between'] as const).map((j) => (
              <button
                key={j}
                onClick={() => setJustify(j)}
                className="px-2 py-1 rounded text-[10px] font-bold transition-all"
                style={{
                  background: justify === j ? 'rgba(255,46,196,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${justify === j ? '#ff2ec4' : 'rgba(255,255,255,0.1)'}`,
                  color: justify === j ? '#ff2ec4' : '#8b8ba3',
                }}
              >
                {j}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="glass rounded-lg p-4 min-h-[180px] flex items-center overflow-hidden"
          style={{ justifyContent: justify, gap }}
          aria-label="Live flexbox preview — three boxes styled by your sliders"
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="transition-all duration-200 text-[12px] font-bold grid place-items-center"
              style={{
                padding,
                margin,
                border: `${border}px solid #ff2ec4`,
                borderRadius: radius,
                background: 'rgba(255,46,196,0.1)',
                color: '#ffb3e6',
                boxShadow: `0 0 ${8 + border * 3}px rgba(255,46,196,0.3)`,
              }}
            >
              box {n}
            </div>
          ))}
        </div>
        <pre
          className="glass rounded-lg p-4 text-[12px] leading-relaxed overflow-x-auto"
          style={{ borderLeft: '3px solid #ff2ec4', color: '#fbcfe8' }}
        >
          <code>{css}</code>
        </pre>
      </div>
    </div>
  )
}
