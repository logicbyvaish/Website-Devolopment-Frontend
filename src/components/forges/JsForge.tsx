import { useMemo, useState } from 'react'
import { ArrowRight, Plus, X } from 'lucide-react'

/**
 * Pedagogy: the function-forge. Learners chain transformation nodes
 * (input → process → output) and watch data mutate at every station —
 * a tactile model of function composition.
 */
type Step = { id: string; label: string; fn: (s: string) => string; code: string }

const LIBRARY: Step[] = [
  { id: 'trim', label: '.trim()', fn: (s) => s.trim(), code: 's.trim()' },
  { id: 'upper', label: '.toUpperCase()', fn: (s) => s.toUpperCase(), code: 's.toUpperCase()' },
  { id: 'lower', label: '.toLowerCase()', fn: (s) => s.toLowerCase(), code: 's.toLowerCase()' },
  { id: 'reverse', label: 'reverse()', fn: (s) => [...s].reverse().join(''), code: "[...s].reverse().join('')" },
  { id: 'snake', label: 'snake_case', fn: (s) => s.trim().replace(/\s+/g, '_'), code: "s.replace(/\\s+/g, '_')" },
  { id: 'len', label: '.length', fn: (s) => String(s.length), code: 'String(s.length)' },
  { id: 'exclaim', label: "+ '!!!'", fn: (s) => s + '!!!', code: "s + '!!!'" },
]

export default function JsForge() {
  const [input, setInput] = useState('  Hello Stack Diver  ')
  const [chain, setChain] = useState<Step[]>([LIBRARY[0], LIBRARY[1]])

  const stages = useMemo(() => {
    const out: string[] = [input]
    let cur = input
    for (const step of chain) {
      cur = step.fn(cur)
      out.push(cur)
    }
    return out
  }, [input, chain])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[11px] uppercase tracking-[0.2em] text-dim">// add machines:</span>
        {LIBRARY.map((s) => (
          <button
            key={s.id}
            onClick={() => chain.length < 5 && setChain([...chain, s])}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(255,214,10,0.08)', border: '1px solid rgba(255,214,10,0.35)', color: '#ffd60a' }}
          >
            <Plus size={10} /> {s.label}
          </button>
        ))}
      </div>

      <div className="glass rounded-lg p-4 overflow-x-auto" style={{ borderLeft: '3px solid #ffd60a' }}>
        <div className="flex items-stretch gap-2 min-w-max">
          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-wider text-dim mb-1">input</p>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Function input string"
              className="w-40 px-3 py-2 rounded bg-black/40 border border-yellow-500/40 text-[12px] outline-none"
              style={{ color: '#fff3b0' }}
            />
          </div>
          {chain.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <ArrowRight size={16} className="text-yellow-500/60 shrink-0" />
              <div
                className="relative rounded-lg px-3 py-2 min-w-[110px]"
                style={{ background: 'rgba(255,214,10,0.1)', border: '1px solid rgba(255,214,10,0.45)', boxShadow: '0 0 14px rgba(255,214,10,0.15)' }}
              >
                <button
                  onClick={() => setChain(chain.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 rounded-full bg-black border border-yellow-500/50 p-0.5 hover:bg-red-900"
                  aria-label={`Remove ${step.label} step`}
                >
                  <X size={10} className="text-yellow-300" />
                </button>
                <p className="text-[11px] font-bold" style={{ color: '#ffd60a' }}>{step.label}</p>
                <p className="text-[10px] text-dim mt-1 truncate max-w-[130px]" title={stages[i + 1]}>
                  → “{stages[i + 1]}”
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <ArrowRight size={16} className="text-yellow-500/60 shrink-0" />
            <div className="flex flex-col justify-center rounded-lg px-3 py-2 bg-black/50 border border-white/15">
              <p className="text-[10px] uppercase tracking-wider text-dim">output</p>
              <p className="text-[13px] font-bold" style={{ color: '#fff3b0' }}>“{stages[stages.length - 1]}”</p>
            </div>
          </div>
        </div>
      </div>

      <pre className="glass rounded-lg p-4 text-[12px] overflow-x-auto" style={{ borderLeft: '3px solid #ffd60a', color: '#fde68a' }}>
        <code>{`const forge = (s) =>\n  ${chain.length ? chain.map((c) => c.code.replace(/^s/, '')).reduce((acc, c) => `${acc}${c.startsWith('.') || c.startsWith(' ') ? c : ''}`, 's') : 's'}${chain.some((c) => !c.code.startsWith('s.') && !c.code.startsWith('s ')) ? '  // composed pipeline' : ''}\n\nforge("${input}")\n// → "${stages[stages.length - 1]}"`}</code>
      </pre>
    </div>
  )
}
