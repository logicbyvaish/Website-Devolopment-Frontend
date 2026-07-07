import { useEffect, useRef, useState } from 'react'
import { Bug, RotateCcw, Timer, Trophy } from 'lucide-react'
import { GAUNTLET } from '../lib/curriculum'
import { burstConfetti, errorPulse } from '../lib/confetti'

const TIME = 90

export default function Gauntlet() {
  const [phase, setPhase] = useState<'idle' | 'run' | 'done'>('idle')
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [left, setLeft] = useState(TIME)
  const [picked, setPicked] = useState<number | null>(null)
  const timerRef = useRef<number>(0)

  useEffect(() => {
    if (phase !== 'run') return
    timerRef.current = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setPhase('done')
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => window.clearInterval(timerRef.current)
  }, [phase])

  const start = () => {
    setPhase('run')
    setIdx(0)
    setScore(0)
    setLeft(TIME)
    setPicked(null)
  }

  const choose = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    const correct = i === GAUNTLET[idx].answer
    if (correct) burstConfetti('#22d3ee', 12)
    else errorPulse()
    setTimeout(() => {
      if (correct) setScore((s) => s + 1)
      if (idx + 1 >= GAUNTLET.length) setPhase('done')
      else {
        setIdx(idx + 1)
        setPicked(null)
      }
    }, 600)
  }

  const rank =
    score >= 6 ? 'ARCHITECT OF WORLDS' : score >= 4 ? 'STACK ARTISAN' : score >= 2 ? 'GUILD APPRENTICE' : 'VOID WANDERER'

  if (phase === 'idle')
    return (
      <div className="text-center">
        <button
          onClick={start}
          className="group relative px-8 py-4 rounded-xl font-display text-sm tracking-widest transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(255,46,196,0.15), rgba(124,58,237,0.2))',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 0 40px rgba(124,58,237,0.35)',
            color: '#fff',
          }}
        >
          <Bug className="inline mr-2 -mt-1" size={16} />
          ENTER THE FULL-STACK GAUNTLET
        </button>
        <p className="text-[11px] text-dim mt-3">{GAUNTLET.length} real bugs · {TIME} seconds · every layer of the stack</p>
      </div>
    )

  if (phase === 'done')
    return (
      <div className="glass rounded-xl p-8 text-center max-w-md mx-auto" style={{ border: '1px solid rgba(34,211,238,0.4)' }}>
        <Trophy size={36} className="mx-auto mb-3" style={{ color: '#ffd60a' }} />
        <p className="text-[11px] uppercase tracking-[0.3em] text-dim">gauntlet complete</p>
        <p className="font-display text-2xl my-3" style={{ color: '#22d3ee', textShadow: '0 0 30px rgba(34,211,238,0.5)' }}>
          {rank}
        </p>
        <p className="text-[13px] text-dim">
          {score}/{GAUNTLET.length} bugs squashed{left === 0 ? ' — time ran out!' : ''}
        </p>
        <button
          onClick={start}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold glass hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={13} /> Run it again
        </button>
      </div>
    )

  const q = GAUNTLET[idx]
  return (
    <div className="glass rounded-xl p-6 max-w-2xl mx-auto" style={{ border: '1px solid rgba(34,211,238,0.35)' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-[11px] tracking-widest" style={{ color: '#22d3ee' }}>
          BUG {idx + 1}/{GAUNTLET.length}
        </span>
        <span
          className="flex items-center gap-1.5 text-[13px] font-bold"
          style={{ color: left <= 15 ? '#f87171' : '#ffd60a' }}
          aria-live="polite"
        >
          <Timer size={14} /> {left}s
        </span>
      </div>
      <div className="h-1 rounded-full bg-black/50 mb-4 overflow-hidden">
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${(left / TIME) * 100}%`, background: left <= 15 ? '#f87171' : 'linear-gradient(90deg,#22d3ee,#ff2ec4)' }}
        />
      </div>
      <p className="text-[14px] font-medium mb-4 leading-relaxed">{q.q}</p>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          const isPicked = picked === i
          const correct = isPicked && i === q.answer
          const wrong = isPicked && i !== q.answer
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className="text-left px-4 py-2.5 rounded-lg text-[12px] transition-all hover:translate-x-1"
              style={{
                background: correct ? 'rgba(52,211,153,0.15)' : wrong ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${correct ? '#34d399' : wrong ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
