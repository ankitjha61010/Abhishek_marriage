import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, target - now)
  const parts = [
    ['Days', Math.floor(diff / 86400000)],
    ['Hours', Math.floor(diff / 3600000) % 24],
    ['Minutes', Math.floor(diff / 60000) % 60],
    ['Seconds', Math.floor(diff / 1000) % 60],
  ]

  return (
    <div className="countdown" role="timer">
      {parts.map(([label, value]) => (
        <div key={label} className="countdown-box">
          <span className="countdown-value">{pad(value)}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  )
}
