import { useId, useLayoutEffect, useRef, useState } from 'react'

const useSvgId = () => useId().replace(/[^a-zA-Z0-9_-]/g, '')

/* ---------- geometry helpers ---------- */

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

// Points spaced roughly `step` apart along a cubic bezier ([x,y] control points)
function alongCubic([a, b, c, d], step) {
  const fine = []
  for (let i = 0; i <= 300; i++) {
    const t = i / 300
    fine.push([cubic(a[0], b[0], c[0], d[0], t), cubic(a[1], b[1], c[1], d[1], t)])
  }
  const out = [fine[0]]
  let acc = 0
  for (let i = 1; i < fine.length; i++) {
    acc += Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1])
    if (acc >= step) {
      out.push(fine[i])
      acc = 0
    }
  }
  return out
}

const quadAsCubic = (p0, q, p2) => [
  p0,
  [p0[0] + (2 / 3) * (q[0] - p0[0]), p0[1] + (2 / 3) * (q[1] - p0[1])],
  [p2[0] + (2 / 3) * (q[0] - p2[0]), p2[1] + (2 / 3) * (q[1] - p2[1])],
  p2,
]

const leafD = (len, w = 0.28) =>
  `M0 0C${len * 0.3} ${-len * w} ${len * 0.75} ${-len * w * 0.9} ${len} 0C${len * 0.75} ${len * w * 0.9} ${len * 0.3} ${len * w} 0 0Z`

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`

/* ---------- CSS background tiles ---------- */

const pearlGrad = `<radialGradient id="p" cx="35%" cy="35%" r="70%"><stop offset="0" stop-color="#fffaf2"/><stop offset=".55" stop-color="#f1d6b8"/><stop offset="1" stop-color="#c8996f"/></radialGradient>`

// Swag valance that repeats horizontally along the top of the curtain stage
export const valanceTile = (() => {
  const beadsLow = alongCubic(quadAsCubic([0, 16], [100, 90], [200, 16]), 7.4)
  const beadsHigh = alongCubic(quadAsCubic([0, 8], [100, 62], [200, 8]), 7.4)
  const beads = [...beadsLow.map((p) => [...p, 3.3]), ...beadsHigh.map((p) => [...p, 2.6])]
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 92">
    <defs>${pearlGrad}
      <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e7b893"/><stop offset=".5" stop-color="#f6d7bd"/><stop offset="1" stop-color="#e2ad86"/>
      </linearGradient>
    </defs>
    <path d="M0 0H200V16Q100 96 0 16Z" fill="url(#f)"/>
    <path d="M0 5Q100 60 200 5" fill="none" stroke="#d9a07a" stroke-width="3" opacity=".55"/>
    <path d="M0 2Q100 40 200 2" fill="none" stroke="#fbe6d3" stroke-width="4" opacity=".7"/>
    <path d="M0 12Q100 78 200 12" fill="none" stroke="#fae3cf" stroke-width="3" opacity=".7"/>
    <path d="M0 15Q100 92 200 15" fill="none" stroke="#c98e66" stroke-width="1.4" opacity=".6"/>
    ${beads.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="url(#p)"/>`).join('')}
    <circle cx="0" cy="12" r="11" fill="#e9bf9c"/><circle cx="200" cy="12" r="11" fill="#e9bf9c"/>
    <circle cx="0" cy="12" r="6" fill="url(#p)"/><circle cx="200" cy="12" r="6" fill="url(#p)"/>
  </svg>`)
})()

// Climbing floral vine used for the page side borders (tiles seamlessly vertically)
export const vineTile = (() => {
  const leaves = [
    [24, 14, 200, 15], [36, 30, -20, 14], [16, 48, 160, 13], [44, 72, -35, 15], [22, 92, 205, 14],
    [38, 108, -10, 13], [18, 134, 170, 15], [42, 152, -25, 14], [16, 172, 190, 13], [40, 198, -40, 15],
    [22, 214, 160, 14], [36, 232, -15, 12],
  ]
  const rose = (x, y, r, c1, c2) => `
    <g transform="translate(${x} ${y})">
      <circle r="${r}" fill="${c1}"/>
      <circle r="${r * 0.68}" fill="${c2}"/>
      <path d="M${-r * 0.35} 0a${r * 0.35} ${r * 0.35} 0 1 1 ${r * 0.35} ${r * 0.35}a${r * 0.2} ${r * 0.2} 0 1 1 0 ${-r * 0.4}" fill="none" stroke="${c1}" stroke-width="1"/>
      <path d="M${-r} 0Q${-r * 1.2} ${r * 0.9} 0 ${r * 1.1}" fill="none" stroke="#fbe1d6" stroke-width=".8" opacity=".8"/>
    </g>`
  const blossom = (x, y) =>
    `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288]
      .map((a) => `<ellipse rx="2.4" ry="4" transform="rotate(${a}) translate(0 -3.2)" fill="#f8ebdc"/>`)
      .join('')}<circle r="1.6" fill="#d9a35f"/></g>`
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 240">
    <path d="M30 0C10 40 50 80 30 120C10 160 50 200 30 240" fill="none" stroke="#5a6640" stroke-width="1.6"/>
    ${leaves
      .map(
        ([x, y, a, l], i) =>
          `<g transform="translate(${x} ${y}) rotate(${a})"><path d="${leafD(l, 0.3)}" fill="${i % 2 ? '#6d7a4c' : '#536139'}"/><path d="M1 0L${l - 2} 0" stroke="#9aa577" stroke-width=".6"/></g>`,
      )
      .join('')}
    ${rose(41, 52, 7, '#d98b7d', '#efb3a5')}
    ${rose(18, 182, 6, '#e3a08f', '#f6c8b9')}
    <circle cx="44" cy="166" r="3" fill="#e7a493"/><circle cx="14" cy="64" r="2.6" fill="#e7a493"/>
    ${blossom(20, 118)}${blossom(46, 232)}${blossom(12, 10)}
  </svg>`)
})()

// Fine linen weave + paper grain
export const linenTexture = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .5 0"/></filter>
  <rect width="180" height="180" filter="url(#n)" opacity=".35"/>
</svg>`)

// Heart silhouette used as a CSS mask for the scratch card
export const heartMask = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 90">
  <path d="M50 88C22 68 2 52 2 28C2 12 14 2 28 2C39 2 46 8 50 16C54 8 61 2 72 2C86 2 98 12 98 28C98 52 78 68 50 88Z"/>
</svg>`)

// Tile images exposed to the stylesheet as custom properties
export const tileVars = {
  '--valance': valanceTile,
  '--vine': vineTile,
  '--linen': linenTexture,
  '--heart-mask': heartMask,
}

/* ---------- Envelope ---------- */

function Sprig({ len = 96, flip = false }) {
  const pts = alongCubic([[0, 0], [len * 0.3, -8], [len * 0.7, 6], [len, 0]], 13)
  return (
    <g>
      <path d={`M0 0C${len * 0.3} -8 ${len * 0.7} 6 ${len} 0`} fill="none" strokeWidth="2" />
      {pts.slice(1).map(([x, y], i) => {
        const side = (i % 2 ? 1 : -1) * (flip ? -1 : 1)
        const size = 22 - i * 1.4
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${side * 52})`}>
            <path d={leafD(size, 0.32)} />
            <path d={`M2 0L${size - 3} 0`} fill="none" strokeWidth=".9" className="vein" />
          </g>
        )
      })}
      <g transform={`translate(${len} 0) rotate(-6)`}>
        <path d={leafD(20, 0.3)} />
      </g>
    </g>
  )
}

export function EmbossedLeaves({ offset = 0 }) {
  const id = useSvgId()
  return (
    <svg className="emboss" width="100%" height="100%" aria-hidden="true">
      <defs>
        <filter id={`${id}e`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="-1" dy="-1" stdDeviation=".4" floodColor="#fff" floodOpacity=".22" result="hi" />
          <feDropShadow in="hi" dx="1.6" dy="2" stdDeviation="1" floodColor="#1e2112" floodOpacity=".55" />
        </filter>
        <pattern
          id={`${id}p`}
          width="220"
          height="250"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${offset} 0)`}
        >
          <g filter={`url(#${id}e)`} fill="#6a6e48" stroke="#6a6e48">
            <g transform="translate(14 70) rotate(-32)">
              <Sprig len={110} />
            </g>
            <g transform="translate(120 205) rotate(-148)">
              <Sprig len={96} flip />
            </g>
            <g transform="translate(150 70) rotate(40) scale(.7)">
              <Sprig len={90} />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}p)`} />
    </svg>
  )
}

function scallopPath(cx, cy, rx, ry, n, amp) {
  let d = ''
  for (let i = 0; i <= 720; i++) {
    const t = (i / 720) * Math.PI * 2
    const r = 1 + amp * Math.abs(Math.sin((n * t) / 2))
    const x = cx + rx * r * Math.sin(t)
    const y = cy - ry * r * Math.cos(t)
    d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return d + 'Z'
}

function Fleur({ y, flip }) {
  return (
    <g transform={`translate(110 ${y}) scale(1 ${flip ? -1 : 1})`} fill="#b98a4c">
      <path d="M0 -14C5 -8 5 -2 0 4C-5 -2 -5 -8 0 -14Z" />
      <path d="M0 2C-6 -2 -14 -2 -16 -8C-10 -10 -4 -6 0 2Z" />
      <path d="M0 2C6 -2 14 -2 16 -8C10 -10 4 -6 0 2Z" />
      <circle cy="7" r="1.8" />
    </g>
  )
}

export function Seal() {
  const id = useSvgId()
  return (
    <svg viewBox="0 0 220 290" className="seal-svg" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}s`} cx="45%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fbe7d4" />
          <stop offset=".7" stopColor="#f2cfb1" />
          <stop offset="1" stopColor="#e2b48d" />
        </radialGradient>
      </defs>
      <path d={scallopPath(110, 145, 92, 128, 18, 0.07)} fill={`url(#${id}s)`} stroke="#c79b63" strokeWidth="2" />
      <path d={scallopPath(110, 145, 78, 112, 18, 0.06)} fill="none" stroke="#b98a4c" strokeWidth="1.5" />
      <ellipse cx="110" cy="145" rx="64" ry="94" fill="none" stroke="#c79b63" strokeWidth=".8" strokeDasharray="2 4" />
      <Fleur y={88} />
      <Fleur y={202} flip />
      <text x="110" y="151" textAnchor="middle" className="seal-text">
        TAP TO OPEN
      </text>
    </svg>
  )
}

/* ---------- Ganesha & entry ornaments ---------- */

const TRUNK = 'M52.5 58.0 L52.7 59.6 L52.8 61.2 L52.9 62.8 L53.0 64.3 L53.0 65.8 L53.1 67.3 L53.1 68.8 L53.2 70.2 L53.2 71.6 L53.2 72.9 L53.2 74.2 L53.2 75.5 L53.2 76.8 L53.1 78.0 L53.1 79.2 L53.0 80.3 L52.9 81.4 L52.8 82.5 L52.7 83.5 L52.6 84.5 L52.4 85.5 L52.3 86.4 L52.1 87.2 L51.9 88.0 L51.7 88.8 L51.4 89.5 L51.2 90.2 L50.9 90.9 L50.7 91.5 L50.4 92.0 L50.1 92.6 L49.8 93.0 L49.5 93.5 L49.1 93.9 L48.8 94.3 L48.4 94.7 L48.0 95.0 L47.5 95.3 L47.0 95.6 L46.4 95.9 L45.9 96.2 L45.5 96.4 L45.1 96.6 L44.7 96.7 L44.3 96.8 L44.0 96.8 L43.7 96.9 L43.4 96.9 L43.1 96.9 L42.8 96.9 L42.6 96.8 L42.3 96.8 L42.1 96.7 L41.9 96.6 L41.7 96.5 L41.5 96.4 L41.3 96.2 L41.1 96.1 L40.9 95.9 L40.7 95.7 L40.6 95.5 L40.4 95.3 L40.3 95.0 L40.2 94.8 L40.1 94.5 L40.1 94.2 L40.1 94.0 L40.0 93.7 L40.1 93.4 L40.1 93.1 L40.2 92.8 L40.3 92.4 L40.4 92.1 L40.6 91.8 L40.9 91.4 L41.2 91.1 L41.5 90.8 L41.9 90.4 L42.3 90.1 L42.9 89.8 L41.1 86.2 L40.4 86.5 L39.6 86.9 L38.9 87.3 L38.3 87.7 L37.7 88.2 L37.1 88.7 L36.6 89.3 L36.1 89.9 L35.7 90.5 L35.4 91.2 L35.1 91.9 L34.8 92.6 L34.6 93.3 L34.5 94.0 L34.5 94.7 L34.5 95.4 L34.5 96.2 L34.6 96.9 L34.8 97.6 L35.0 98.3 L35.3 99.0 L35.7 99.7 L36.0 100.3 L36.5 100.9 L37.0 101.5 L37.6 102.1 L38.2 102.6 L38.8 103.1 L39.6 103.5 L40.3 103.9 L41.1 104.2 L42.0 104.5 L42.8 104.6 L43.7 104.8 L44.7 104.8 L45.6 104.8 L46.6 104.7 L47.6 104.6 L48.6 104.3 L49.6 104.1 L50.6 103.7 L51.6 103.3 L52.7 102.8 L53.6 102.2 L54.6 101.6 L55.5 100.9 L56.3 100.2 L57.2 99.4 L57.9 98.5 L58.6 97.7 L59.3 96.7 L59.9 95.8 L60.5 94.8 L61.1 93.8 L61.6 92.7 L62.1 91.6 L62.5 90.5 L62.9 89.4 L63.3 88.2 L63.7 87.0 L64.0 85.8 L64.3 84.5 L64.6 83.3 L64.9 82.0 L65.1 80.6 L65.3 79.3 L65.6 77.9 L65.8 76.5 L65.9 75.1 L66.1 73.6 L66.3 72.2 L66.4 70.7 L66.6 69.2 L66.7 67.6 L66.8 66.1 L67.0 64.5 L67.1 62.9 L67.2 61.3 L67.3 59.7 L67.5 58.0Z'
const TRUNK_RIDGES = [
  'M53.1 67.3 L66.7 67.6',
  'M53.2 75.5 L65.8 76.5',
  'M52.8 82.5 L64.3 84.5',
  'M51.9 88.0 L62.1 91.6',
  'M50.4 92.0 L58.6 97.7',
  'M48.4 94.7 L53.6 102.2',
  'M45.5 96.4 L47.6 104.6',
]

// Gold-foil Ganesha face (trunk curls to the left)
export function Ganesha({ className = '' }) {
  const id = useSvgId()
  const gold = `url(#${id}g)`
  return (
    <svg viewBox="0 0 120 112" className={className} aria-label="Shri Ganesha" role="img">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7e3ad" />
          <stop offset=".35" stopColor="#d9b06a" />
          <stop offset=".6" stopColor="#f3d797" />
          <stop offset="1" stopColor="#a87b3c" />
        </linearGradient>
      </defs>
      <g fill={gold}>
        <path d="M43 36 L45 24 Q50 13 60 6 Q70 13 75 24 L77 36 Z" />
        <circle cx="60" cy="5" r="3.4" />
        <rect x="37" y="33" width="46" height="8" rx="3" />
        <path d="M43 44 C30 30 10 33 8 50 C6 68 22 79 41 72 Z" />
        <path d="M77 44 C90 30 110 33 112 50 C114 68 98 79 79 72 Z" />
        <ellipse cx="60" cy="56" rx="21" ry="18" />
        <path d={TRUNK} />
      </g>
      <path d="M68 67 Q76 72 75 83 L71.5 82 Q72 74 65 70Z" fill="#fbf1dc" stroke="#3a3e26" strokeWidth=".8" />
      <g fill="none" stroke="#3a3e26" strokeWidth="1.4" strokeLinecap="round">
        <path d="M47 28 Q60 23 73 28" />
        <path d="M50 20 Q60 15 70 20" />
        <path d="M40 37 H80" strokeDasharray="1.2 2.8" />
        <path d="M40 48 C30 40 17 43 16 53 C15 62 24 68 34 66" />
        <path d="M80 48 C90 40 103 43 104 53 C105 62 96 68 86 66" />
        <path d="M45 46 Q50 43 55 46" />
        <path d="M65 46 Q70 43 75 46" />
        {TRUNK_RIDGES.map((d) => (
          <path key={d} d={d} strokeWidth="1.1" />
        ))}
      </g>
      <circle cx="60" cy="37" r="2.6" fill="#b8402e" stroke="#f7e3ad" strokeWidth=".8" />
      <g fill="#3a3e26">
        <path d="M46 52 Q50.5 48 55 52 Q50.5 54.5 46 52Z" />
        <path d="M65 52 Q69.5 48 74 52 Q69.5 54.5 65 52Z" />
      </g>
      <path d="M60 42 Q57.8 45.5 60 49 Q62.2 45.5 60 42Z" fill="#b8402e" />
    </svg>
  )
}

// Gold scroll for the envelope frame corners (top-left orientation; rotate for others)
export function CornerFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M4 76 V12 Q4 4 12 4 H76" />
        <path d="M10 70 V18 Q10 10 18 10 H70" strokeWidth=".8" />
        <path d="M18 40 C18 26 26 18 40 18" />
        <path d="M18 40 C24 34 22 26 16 26 C12 26 12 32 16 32" />
        <path d="M40 18 C34 24 26 22 26 16 C26 12 32 12 32 16" />
      </g>
      <g fill="currentColor">
        <circle cx="18" cy="18" r="3.2" />
        <path d="M24 24 Q32 26 34 34 Q26 32 24 24Z" />
        <circle cx="46" cy="18" r="1.6" />
        <circle cx="18" cy="46" r="1.6" />
      </g>
    </svg>
  )
}

/* ---------- Curtain stage ---------- */

const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
const stage = (p, from, to) => easeInOut(Math.min(1, Math.max(0, (p - from) / (to - from))))
const lerp = (a, b, t) => a + (b - a) * t

// Left curtain drawn in pixel space (mirror with CSS for the right side).
// `progress` 0 = closed across its half of the stage, 1 = drawn aside and tied back.
// The top moves first, the hem trails, and the middle is pulled into the tie-back last.
export function Curtain({ progress = 1 }) {
  const id = useSvgId()
  const ref = useRef(null)
  const [size, setSize] = useState({ w: 200, h: 800 })

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  const { w: W, h: H } = size
  const s = Math.min(190, Math.max(78, W * 0.5)) / 150 // tied-back width relative to the original 150-unit design
  const ty = 0.54 * H
  const top = stage(progress, 0, 0.75)
  const mid = stage(progress, 0.12, 1)
  const low = stage(progress, 0.05, 0.9)
  const closed = W + 1
  const x = {
    t: lerp(closed, 146 * s, top),
    c1: lerp(closed, 128 * s, top),
    c2: lerp(closed, 75 * s, mid),
    m: lerp(closed, 50 * s, mid),
    d1: lerp(closed, 60 * s, mid),
    d2: lerp(closed, 95 * s, low),
    b: lerp(closed, 110 * s, low),
  }
  const edgeAt = (f) =>
    `M${f * x.t} 0C${f * x.c1} ${0.24 * H} ${f * x.c2} ${0.43 * H} ${f * x.m} ${ty}C${f * x.d1} ${0.7 * H} ${f * x.d2} ${0.88 * H} ${f * x.b} ${H}`
  const upper = [[x.t, 0], [x.c1, 0.24 * H], [x.c2, 0.43 * H], [x.m, ty]]
  const lower = [[x.m, ty], [x.d1, 0.7 * H], [x.d2, 0.88 * H], [x.b, H]]
  const r = Math.min(5, Math.max(3.2, 4 * s))
  const pearls = [...alongCubic(upper, r * 2.5), ...alongCubic(lower, r * 2.5).slice(1)]
  const tie = stage(progress, 0.78, 1)

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="curtain-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}c`} x1="0" x2="1">
          <stop offset="0" stopColor="#dfa57f" />
          <stop offset=".4" stopColor="#f3cdae" />
          <stop offset=".75" stopColor="#f8dcc4" />
          <stop offset="1" stopColor="#e8b893" />
        </linearGradient>
        <radialGradient id={`${id}p`} cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset=".55" stopColor="#f1d6b8" />
          <stop offset="1" stopColor="#c8996f" />
        </radialGradient>
        <linearGradient id={`${id}t`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6dcc2" />
          <stop offset="1" stopColor="#d6a078" />
        </linearGradient>
      </defs>
      {/* Soft edge shadow painted in the SVG — a CSS drop-shadow filter leaves ghost shadows on iOS Safari */}
      <g fill="none" stroke="#6e3c1e" transform="translate(3 0)">
        {[10, 6, 3].map((sw) => (
          <path key={sw} d={edgeAt(1)} strokeWidth={sw} strokeOpacity=".07" />
        ))}
      </g>
      <path d={`${edgeAt(1)}H0V0Z`} fill={`url(#${id}c)`} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} fill="none">
          <path d={edgeAt((i + 0.6) / 10)} stroke="#c98f68" strokeOpacity=".35" strokeWidth={(i % 2 ? 4 : 2.5) * s} />
          <path d={edgeAt((i + 1) / 10)} stroke="#fff1e3" strokeOpacity=".45" strokeWidth={2.5 * s} />
        </g>
      ))}
      {pearls.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={r} fill={`url(#${id}p)`} />
      ))}
      {tie > 0 && (
        <g opacity={tie}>
          <path
            d={`M0 ${ty - 18 * s}Q${x.m * 0.5} ${ty + 8 * s} ${x.m + 10 * s} ${ty - 6 * s}L${x.m + 12 * s} ${ty + 14 * s}Q${x.m * 0.5} ${ty + 30 * s} 0 ${ty + 7 * s}Z`}
            fill={`url(#${id}t)`}
          />
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={(5 + i * 10.5) * s} cy={ty + (2 - i * 0.6) * s} r={3.8 * s} fill={`url(#${id}p)`} />
          ))}
          <g transform={`translate(${x.m + 10 * s} ${ty + 12 * s}) scale(${0.85 * s})`}>
            <path d="M0 0Q-3 12 0 22" stroke="#d3a17b" strokeWidth="2" fill="none" />
            <circle cy="26" r="8" fill={`url(#${id}p)`} />
            <path d="M-9 32Q0 30 9 32L13 88Q0 94 -13 88Z" fill={`url(#${id}t)`} />
            {[-9, -5, -1, 3, 7].map((tx) => (
              <path key={tx} d={`M${tx} 36L${tx * 1.3} 88`} stroke="#c58e66" strokeWidth=".9" opacity=".7" />
            ))}
            <rect x="-10" y="34" width="20" height="5" rx="2.5" fill="#e4bb98" />
          </g>
        </g>
      )}
    </svg>
  )
}

function Cypress({ x, base, h, w = 15 }) {
  const top = base - h
  return (
    <g>
      <path
        d={`M${x} ${top}C${x + w} ${top + h * 0.25} ${x + w + 2} ${base - h * 0.2} ${x + w * 0.6} ${base}H${x - w * 0.6}C${x - w - 2} ${base - h * 0.2} ${x - w} ${top + h * 0.25} ${x} ${top}Z`}
        fill="#465535"
      />
      {Array.from({ length: Math.floor(h / 12) }, (_, i) => {
        const y = top + 14 + i * 12
        const s = Math.min(1, (i + 2) / 5) * w * 0.7
        return (
          <path key={i} d={`M${x - s} ${y}Q${x} ${y - 7} ${x + s} ${y}`} fill="none" stroke="#6b7a4c" strokeWidth="1.2" opacity=".7" />
        )
      })}
    </g>
  )
}

function Bush({ x, y, s = 1 }) {
  const leaves = [[-14, 4, 11], [0, -4, 13], [14, 4, 11], [-6, 8, 10], [8, 9, 10]]
  const roses = [[-12, -2, '#e8a596'], [4, -10, '#f3c4b4'], [13, 0, '#d98a7c'], [-2, 4, '#f6d0c0'], [-18, 8, '#f3c4b4']]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {leaves.map(([lx, ly, r], i) => (
        <circle key={i} cx={lx} cy={ly} r={r} fill={i % 2 ? '#5b6a40' : '#4d5c36'} />
      ))}
      {roses.map(([rx, ry, c], i) => (
        <g key={i} transform={`translate(${rx} ${ry})`}>
          <circle r="4.6" fill={c} />
          <circle r="2.4" fill="#fff" opacity=".35" />
        </g>
      ))}
    </g>
  )
}

function Urn({ x }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <Bush x={0} y={126} s={0.75} />
      <path d="M-13 134H13L9 150Q0 156 -9 150Z" fill="#f2e2d0" stroke="#d2b498" />
      <rect x="-5" y="150" width="10" height="8" fill="#ead6c1" />
      <rect x="-14" y="158" width="28" height="40" rx="2" fill="#f4e6d6" stroke="#d2b498" />
      <rect x="-17" y="156" width="34" height="5" rx="1.5" fill="#ecdac6" />
      <rect x="-17" y="194" width="34" height="5" rx="1.5" fill="#ecdac6" />
    </g>
  )
}

// Fountain water. The tall centre jet bursts at TOP and falls in arcs, some into the upper bowl and the rest
// into the big basin; the upper bowl spills over its rim in sheets.
const TOP = 68
const arc = (dx, yEnd) => `M200 ${TOP + 2}Q${200 + dx * 0.45} ${TOP - 24} ${200 + dx} ${yEnd}`
const WATER_ARCS = [
  [18, 142],
  [26, 143],
  [44, 182],
  [58, 184],
  [72, 185],
].flatMap(([dx, y]) => [arc(-dx, y), arc(dx, y)])
const WATER_FALLS = [172, 176, 180, 184].flatMap((x, i) => {
  const drop = 5 + i * 1.5
  return [
    `M${x} 146Q${x - drop} 160 ${x - drop - 1} 183`,
    `M${400 - x} 146Q${400 - x + drop} 160 ${400 - x + drop + 1} 183`,
  ]
})

export function Garden() {
  const id = useSvgId()
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" className="garden-svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb3b2" />
          <stop offset="1" stopColor="#c8d4cf" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf2e8" />
          <stop offset="1" stopColor="#e2cbb3" />
        </linearGradient>
      </defs>
      {/* hedge behind the fountain */}
      <path d="M40 176Q40 150 70 152Q90 140 115 150Q140 142 160 154H240Q260 142 285 150Q310 140 330 152Q360 150 360 176Z" fill="#56653d" />
      <Cypress x={22} base={200} h={150} />
      <Cypress x={56} base={204} h={112} w={13} />
      <Cypress x={378} base={200} h={150} />
      <Cypress x={344} base={204} h={112} w={13} />
      <Bush x={30} y={196} s={1.2} />
      <Bush x={370} y={196} s={1.2} />
      <Urn x={98} />
      <Urn x={302} />
      {/* fountain */}
      <path d="M190 182V146H210V182Z" fill={`url(#${id}s)`} stroke="#d2b498" />
      <path d="M172 144Q200 160 228 144Z" fill={`url(#${id}s)`} stroke="#d2b498" />
      <ellipse cx="200" cy="144" rx="28" ry="5" fill="#f6ebdf" stroke="#d2b498" />
      <ellipse cx="200" cy="144" rx="22" ry="3" fill={`url(#${id}w)`} />
      <path d="M197 142V128Q200 122 203 128V142Z" fill="#f4e6d6" stroke="#d2b498" />
      <path d="M100 196Q100 212 200 214Q300 212 300 196V186H100Z" fill={`url(#${id}s)`} stroke="#d2b498" />
      <ellipse cx="200" cy="186" rx="100" ry="16" fill="#f6ebdf" stroke="#d2b498" />
      <ellipse cx="200" cy="186" rx="90" ry="12" fill={`url(#${id}w)`} />
      {/* animated water: sheets spilling from the upper bowl, ripples, the tall jet, its spray arcs and droplets */}
      <path d="M171 146Q164 162 162 183H182Q178 162 180 148Z" fill="#e9f3f3" opacity=".45" />
      <path d="M229 146Q236 162 238 183H218Q222 162 220 148Z" fill="#e9f3f3" opacity=".45" />
      <g fill="none" stroke="#f4fbfb" strokeWidth="1">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} className="water-ripple" cx="200" cy="186" rx="30" ry="4.5" style={{ animationDelay: `${i}s` }} />
        ))}
        {[-72, -58, -44, -18, 18, 44, 58, 72].map((dx, i) => (
          <ellipse
            key={dx}
            className="water-ripple"
            cx={200 + dx}
            cy={Math.abs(dx) < 30 ? 143 : 184}
            rx={Math.abs(dx) < 30 ? 4 : 7}
            ry="1.6"
            style={{ animationDelay: `${(i % 4) * 0.45}s` }}
          />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        <path d={`M200 127V${TOP}`} stroke="#a9c6ca" strokeWidth="5" opacity=".45" />
        <path d={`M200 127V${TOP}`} className="water-flow water-flow--jet" stroke="#ffffff" strokeWidth="2.6" />
        {WATER_ARCS.concat(WATER_FALLS).map((d) => (
          <g key={d}>
            <path d={d} stroke="#a9c6ca" strokeWidth="2.2" opacity=".5" />
            <path d={d} className="water-flow" stroke="#ffffff" strokeWidth="1.3" />
          </g>
        ))}
      </g>
      <g fill="#ffffff">
        {WATER_ARCS.map((d, i) => (
          <circle key={d} r={i % 3 ? 1.1 : 1.5} opacity=".9">
            <animateMotion dur={`${1.3 + (i % 4) * 0.15}s`} begin={`${(i * 0.23) % 1.3}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}
      </g>
      <ellipse cx="200" cy={TOP - 2} rx="14" ry="7" fill="#ffffff" className="water-mist" />
      <circle cx="200" cy={TOP} r="3" fill="#ffffff" className="water-crest" />
      <Bush x={120} y={206} s={0.9} />
      <Bush x={280} y={206} s={0.9} />
    </svg>
  )
}

/* ---------- small ornaments & icons ---------- */

export function Heart({ size = 18, className = '' }) {
  return (
    <svg viewBox="0 0 24 22" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 21S1 14.2 1 7.2A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 11 2.6C23 14.2 12 21 12 21Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Divider({ wide = false }) {
  return (
    <div className={`divider${wide ? ' divider--wide' : ''}`} aria-hidden="true">
      <span />
      <Heart size={10} />
      <span />
    </div>
  )
}

const Icon = ({ children, size = 30 }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const icons = {
  clock: (
    <Icon>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9v7l4.5 3" />
    </Icon>
  ),
  pin: (
    <Icon>
      <path d="M16 29s9-8.6 9-15.5a9 9 0 0 0-18 0C7 20.4 16 29 16 29Z" />
      <circle cx="16" cy="13.5" r="3.4" />
    </Icon>
  ),
  calendar: (
    <Icon size={18}>
      <rect x="5" y="7" width="22" height="20" rx="2.5" />
      <path d="M5 13h22M11 4v5M21 4v5" />
    </Icon>
  ),
  kalash: (
    <Icon size={22}>
      <path d="M10 13h12M11 13c-4 3-4 11 1 13h8c5-2 5-10 1-13" />
      <path d="M12 13c0-2 1-3 4-3s4 1 4 3" />
      <path d="M16 10c-3-3-6-3-7-2 2 0 4 1 7 2Zm0 0c3-3 6-3 7-2-2 0-4 1-7 2Zm0 0V5" />
      <circle cx="16" cy="4.5" r="1.5" />
    </Icon>
  ),
  mehndi: (
    <Icon size={22}>
      <path d="M10 28v-9l-3-4.5a1.6 1.6 0 0 1 2.6-1.9L12 15V6.5a1.5 1.5 0 0 1 3 0V14V4.5a1.5 1.5 0 0 1 3 0V14V6a1.5 1.5 0 0 1 3 0v8.5V9a1.5 1.5 0 0 1 3 0v10c0 4-2.5 9-6 9" />
      <circle cx="17" cy="20" r="2" />
      <path d="M17 16.5v1M17 22.5v1M13.5 20h1M19.5 20h1" />
    </Icon>
  ),
  rings: (
    <Icon size={22}>
      <circle cx="12" cy="19" r="7" />
      <circle cx="20" cy="19" r="7" />
      <path d="m13 8 3-4 3 4-3 3Z" />
    </Icon>
  ),
  party: (
    <Icon>
      <path d="M5 27 11 11l10 10Z" />
      <path d="M16 6c1 2 0 3-1 4M22 10c2-1 4 0 5 1M20 4l.5 2M26 6l-2 1.5M25 16l2 .5" />
    </Icon>
  ),
  family: (
    <Icon>
      <circle cx="11" cy="10" r="3.5" />
      <circle cx="21" cy="10" r="3.5" />
      <path d="M4 26c0-5 3-8 7-8s7 3 7 8M14 26c0-5 3-8 7-8s7 3 7 8" />
    </Icon>
  ),
  letter: (
    <Icon>
      <rect x="4" y="8" width="24" height="17" rx="2" />
      <path d="m5 9.5 11 8.5 11-8.5" />
    </Icon>
  ),
  soundOn: (
    <Icon size={18}>
      <path d="M5 12h4l6-5v18l-6-5H5Z" fill="currentColor" />
      <path d="M20 11.5a6 6 0 0 1 0 9M23.5 8a11 11 0 0 1 0 16" />
    </Icon>
  ),
  soundOff: (
    <Icon size={18}>
      <path d="M5 12h4l6-5v18l-6-5H5Z" fill="currentColor" />
      <path d="m20 13 6 6m0-6-6 6" />
    </Icon>
  ),
  navigate: (
    <Icon size={18}>
      <path d="M27 5 5 14.5l9.5 3 3 9.5Z" />
    </Icon>
  ),
  chevron: (
    <Icon size={22}>
      <path d="m9 12 7 7 7-7" />
    </Icon>
  ),
}
