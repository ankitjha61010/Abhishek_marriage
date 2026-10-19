import { useEffect, useState } from 'react'
import { wedding } from '../data'
import { Curtain, Divider, Ganesha, Garden, icons } from './Ornaments'

const OPEN_DELAY = 900
const OPEN_DURATION = 3000

// 0 → 1 over the curtain-opening animation, starting once `play` turns on
function useCurtainProgress(play) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!play) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let start
    const tick = (now) => {
      start ??= now
      const p = reduce ? 1 : Math.min(1, Math.max(0, (now - start - OPEN_DELAY) / OPEN_DURATION))
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play])
  return progress
}

// Curtain stage: the curtains draw aside and tie back to reveal the couple's names
export default function Hero({ play }) {
  const { groom, bride } = wedding
  const progress = useCurtainProgress(play)
  return (
    <section className={`hero linen${play ? ' hero--play' : ''}`}>
      <div className="hero-curtain hero-curtain--left">
        <Curtain progress={progress} />
      </div>
      <div className="hero-curtain hero-curtain--right">
        <Curtain progress={progress} />
      </div>
      <div className="valance" />

      <div className="hero-content">
        <Ganesha className="hero-ganesha" />
        <p className="invocation">॥ श्री गणेशाय नमः ॥</p>
        <p className="shloka shloka--front">
          {wedding.shlokas.front.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <p className="hero-kicker">We&rsquo;re getting married</p>
        <Divider />
        <h1 className="script hero-name">{groom.name}</h1>
        <p className="hero-parents">
          Son of
          <br />
          Mr. {groom.father}
          <br />
          &amp; Mrs. {groom.mother}
        </p>
        <p className="script hero-amp">&amp;</p>
        <h1 className="script hero-name">{bride.name}</h1>
        <p className="hero-parents">
          Daughter of
          <br />
          Mr. {bride.father}
          <br />
          &amp; Mrs. {bride.mother}
        </p>
      </div>

      <div className="hero-garden">
        <Garden />
      </div>
      <div className="scroll-hint" aria-hidden="true">
        {icons.chevron}
      </div>
    </section>
  )
}
