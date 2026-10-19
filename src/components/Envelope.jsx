import { useState } from 'react'
import { wedding } from '../data'
import { playOpenSound } from '../openSound'
import { CornerFlourish, EmbossedLeaves, Ganesha, Seal } from './Ornaments'

const SPARKLES = [
  [12, 18, 0], [86, 14, 1.2], [22, 44, 2.1], [80, 38, 0.6], [10, 70, 1.6], [90, 64, 2.6],
  [30, 86, 0.9], [72, 88, 1.9], [50, 30, 2.9], [64, 58, 0.3], [36, 60, 1.4], [56, 76, 2.3],
]

const mainEvent = wedding.events.find((ev) => ev.main) ?? wedding.events[0]
const [y, m, d] = mainEvent.date.split('-').map(Number)
const weddingDay = new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

// Olive envelope whose two doors swing open when the seal is tapped
export default function Envelope({ onOpen, onDone }) {
  const [opening, setOpening] = useState(false)

  const open = () => {
    if (opening) return
    setOpening(true)
    playOpenSound()
    onOpen()
    setTimeout(onDone, 1900)
  }

  return (
    <div
      className={`envelope${opening ? ' envelope--open' : ''}`}
      onClick={open}
      role="button"
      tabIndex={0}
      aria-label="Tap to open the invitation"
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
    >
      <div className="door door--left">
        <EmbossedLeaves />
      </div>
      <div className="door door--right">
        <EmbossedLeaves offset={110} />
        <span className="door-seam" />
      </div>

      <div className="envelope-art">
        <div className="env-frame" aria-hidden="true">
          {['tl', 'tr', 'bl', 'br'].map((c) => (
            <CornerFlourish key={c} className={`env-corner env-corner--${c}`} />
          ))}
        </div>

        <div className="sparkles" aria-hidden="true">
          {SPARKLES.map(([left, top, delay], i) => (
            <span key={i} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }} />
          ))}
        </div>

        <header className="env-top">
          <div className="ganesha-medallion">
            <span className="ganesha-orbit" aria-hidden="true" />
            <span className="ganesha-aura" aria-hidden="true">
              <span className="ganesha-rays" />
              <span className="ganesha-shine" />
            </span>
            <Ganesha className="ganesha" />
          </div>
          <p className="env-mantra">॥ श्री गणेशाय नमः ॥</p>
          <p className="env-shubh">शुभ विवाह</p>
          <p className="env-shloka">
            {wedding.shlokas.entry.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </header>

        <div className="seal">
          <span className="seal-glow" aria-hidden="true" />
          <Seal />
        </div>

        <footer className="env-plaque">
          <p className="env-names">
            {wedding.groom.shortName} <span>&amp;</span> {wedding.bride.shortName}
          </p>
          <p className="env-date">{weddingDay}</p>
        </footer>
      </div>
    </div>
  )
}
