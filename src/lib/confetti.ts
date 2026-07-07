const SYMBOLS = ['</>', '{ }', '=>', ';', '()', '#', '<div>', '&&', '...', '::']

export function burstConfetti(color: string, count = 26) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const cx = window.innerWidth / 2
  const cy = window.innerHeight / 2
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;z-index:9999;pointer-events:none;font-family:'JetBrains Mono',monospace;font-weight:700;font-size:${12 + Math.random() * 14}px;color:${color};text-shadow:0 0 12px ${color};will-change:transform,opacity;`
    document.body.appendChild(el)
    const angle = Math.random() * Math.PI * 2
    const dist = 120 + Math.random() * 260
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 80
    const rot = (Math.random() - 0.5) * 540
    const anim = el.animate(
      [
        { transform: 'translate(-50%,-50%) rotate(0deg) scale(1)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 100}px)) rotate(${rot}deg) scale(0.6)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 700, easing: 'cubic-bezier(0.16,1,0.3,1)' }
    )
    anim.onfinish = () => el.remove()
  }
}

export function errorPulse() {
  const el = document.createElement('div')
  el.style.cssText =
    'position:fixed;inset:0;z-index:9998;pointer-events:none;box-shadow:inset 0 0 120px rgba(255,60,80,0.45);'
  document.body.appendChild(el)
  const anim = el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
    duration: 600,
    easing: 'ease-in-out',
  })
  anim.onfinish = () => el.remove()
}
