import { useEffect, useMemo, useRef, useState } from 'react'

// Fades/slides children in when they scroll into view
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? ' reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

const rand = (a, b) => a + Math.random() * (b - a)

// Soft dots drifting down, like the reference's "Our forever begins" section
export function FallingPetals({ count = 22 }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: rand(2, 98),
        size: rand(4, 9),
        dur: rand(6, 12),
        delay: rand(-12, 0),
        drift: rand(-30, 30),
        tone: Math.random() > 0.55 ? 'gold' : Math.random() > 0.5 ? 'olive' : 'rose',
      })),
    [count],
  )
  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal petal--${p.tone}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

const CONFETTI_COLORS = ['#c9a25f', '#e8a596', '#5f6342', '#f3d2b6', '#d98a7c', '#8a9566']

// One-shot confetti burst from the centre of the screen
export function Confetti({ fire }) {
  const pieces = useMemo(
    () =>
      fire
        ? Array.from({ length: 70 }, () => ({
            x: rand(-48, 48),
            y: rand(-60, -20),
            r: rand(-540, 540),
            c: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            w: rand(6, 10),
            round: Math.random() > 0.6,
            delay: rand(0, 0.25),
          }))
        : [],
    [fire],
  )
  if (!fire) return null
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            '--x': `${p.x}vw`,
            '--y': `${p.y}vh`,
            '--r': `${p.r}deg`,
            background: p.c,
            width: p.w,
            height: p.round ? p.w : p.w * 0.45,
            borderRadius: p.round ? '50%' : 2,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
