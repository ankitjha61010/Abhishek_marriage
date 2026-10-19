import { useEffect, useRef, useState } from 'react'

// Share of the card's bounding box that must be cleared (the heart fills ~70% of it)
const REVEAL_AT = 0.38

// Heart-shaped scratch card; calls onReveal once enough of the foil is cleared
export default function ScratchHeart({ children, onReveal }) {
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const foil = ctx.createLinearGradient(0, 0, width, height)
    foil.addColorStop(0, '#d9b07a')
    foil.addColorStop(0.35, '#f4dcb6')
    foil.addColorStop(0.55, '#c99a5e')
    foil.addColorStop(0.8, '#f1d3a6')
    foil.addColorStop(1, '#b98a4c')
    ctx.fillStyle = foil
    ctx.fillRect(0, 0, width, height)
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.35})`
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4)
    }
    ctx.fillStyle = '#5b4325'
    ctx.textAlign = 'center'
    ctx.font = `italic 500 ${Math.round(width * 0.075)}px "Cormorant Garamond", serif`
    ctx.fillText('Scratch here', width / 2, height * 0.42)
    ctx.font = `${Math.round(width * 0.09)}px serif`
    ctx.fillText('✦', width / 2, height * 0.56)

    let drawing = false
    let last = null
    let moves = 0
    let done = false
    const radius = Math.max(18, width * 0.08)

    const pos = (e) => {
      const r = canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top]
    }
    const scratch = ([x, y]) => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineWidth = radius * 2
      ctx.beginPath()
      ctx.moveTo(...(last || [x, y]))
      ctx.lineTo(x, y)
      ctx.stroke()
      last = [x, y]
      if (++moves % 8 === 0) check()
    }
    const check = () => {
      if (done) return
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let clear = 0
      let total = 0
      // sample every 16th pixel's alpha
      for (let i = 3; i < data.length; i += 64) {
        total++
        if (data[i] < 40) clear++
      }
      if (clear / total > REVEAL_AT) {
        done = true
        setRevealed(true)
        onReveal?.()
      }
    }
    const down = (e) => {
      drawing = true
      last = null
      canvas.setPointerCapture(e.pointerId)
      scratch(pos(e))
    }
    const move = (e) => drawing && scratch(pos(e))
    const up = () => {
      drawing = false
      last = null
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
    // run once; onReveal is stable enough for a one-shot card
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`scratch${revealed ? ' scratch--done' : ''}`}>
      <div className="scratch-heart">
        <div className="scratch-content">{children}</div>
        <canvas ref={canvasRef} className="scratch-canvas" aria-label="Scratch to reveal the date" />
      </div>
    </div>
  )
}
