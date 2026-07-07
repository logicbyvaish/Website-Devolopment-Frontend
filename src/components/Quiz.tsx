import { useState } from 'react'
import { ShieldCheck, SkipForward, Swords } from 'lucide-react'
import type { QuizQ } from '../lib/curriculum'
import { burstConfetti, errorPulse } from '../lib/confetti'

/**
 * Pedagogy: the progress gate. Two failed attempts unlock a soft-skip —
 * challenge without punishment keeps momentum (mastery ≠ gatekeeping).
 */
export default function Quiz({
  questions,
  color,
  onPass,
  passed,
}: {
  questions: QuizQ[]
  color: string
  onPass: () => void
  passed: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [fails, setFails] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [wrongSet, setWrongSet] = useState<Set<number>>(new Set())

  if (passed) {
    return (
      <div className="glass rounded-xl p-6 flex items-center gap-4" style={{ border: `1px solid ${color}55` }}>
        <ShieldCheck size={28} style={{ color }} />
        <div>
          <p className="font-display text-sm" style={{ color }}>GATE CLEARED</p>
          <p className="text-[12px] text-dim mt-0.5">This layer is forged into your record. Descend deeper.</p>
        </div>
      </div>
    )
  }

  const q = questions[idx]

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) {
      setTimeout(() => {
        if (idx + 1 >= questions.length) {
          burstConfetti(color)
          onPass()
        } else {
          setIdx(idx + 1)
          setPicked(null)
          setWrongSet(new Set())
        }
      }, 650)
    } else {
      errorPulse()
      setFails((f) => f + 1)
      setWrongSet(new Set(wrongSet).add(i))
      setTimeout(() => setPicked(null), 500)
    }
  }

  return (
    <div className="glass rounded-xl p-6" style={{ border: `1px solid ${color}40` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords size={16} style={{ color }} />
          <span className="font-display text-[11px] tracking-widest" style={{ color }}>
            PROGRESS GATE — {idx + 1}/{questions.length}
          </span>
        </div>
        <div className="flex gap-1.5" aria-label={`Question ${idx + 1} of ${questions.length}`}>
          {questions.map((_, i) => (
            <span
              key={i}
              className="w-6 h-1 rounded-full"
              style={{ background: i < idx ? color : i === idx ? `${color}88` : 'rgba(255,255,255,0.12)' }}
            />
          ))}
        </div>
      </div>
      <p className="text-[14px] font-medium mb-4 leading-relaxed">{q.q}</p>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const correct = isPicked && i === q.answer
          const wrong = wrongSet.has(i) || (isPicked && i !== q.answer)
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={picked !== null && picked === q.answer}
              className="text-left px-4 py-3 rounded-lg text-[12px] transition-all hover:translate-x-0.5"
              style={{
                background: correct ? 'rgba(52,211,153,0.15)' : wrong ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${correct ? '#34d399' : wrong ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                color: correct ? '#6ee7b7' : wrong ? '#fca5a5' : '#d5d6e8',
              }}
            >
              <span className="text-dim mr-2">{String.fromCharCode(65 + i)}·</span>
              {opt}
            </button>
          )
        })}
      </div>
      {fails >= 2 && (
        <button
          onClick={() => {
            burstConfetti('#8b8ba3', 10)
            onPass()
          }}
          className="mt-4 flex items-center gap-2 text-[11px] text-dim hover:text-ink transition-colors"
        >
          <SkipForward size={13} />
          Tough one — soft-skip this gate and keep exploring. No shame in the guild.
        </button>
      )}
    </div>
  )
}
