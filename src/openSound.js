// Sound for opening the envelope: a soft paper whoosh as the doors swing, with a two-note temple-bell chime.
// Synthesised with Web Audio so there is no file to download. Must be called from the tap itself (iOS rule).

const BELL_PARTIALS = [
  [1, 0.5],
  [2.76, 0.22],
  [5.4, 0.1],
  [8.93, 0.05],
]

function bell(ctx, out, freq, at, volume) {
  BELL_PARTIALS.forEach(([ratio, level], i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq * ratio
    const decay = 2.6 / (1 + i * 0.8) // higher partials die away sooner, like a real bell
    gain.gain.setValueAtTime(0, at)
    gain.gain.linearRampToValueAtTime(level * volume, at + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + decay)
    osc.connect(gain).connect(out)
    osc.start(at)
    osc.stop(at + decay)
  })
}

function whoosh(ctx, out, at, length) {
  const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 0.8
  filter.frequency.setValueAtTime(350, at)
  filter.frequency.exponentialRampToValueAtTime(1800, at + length * 0.6)
  filter.frequency.exponentialRampToValueAtTime(700, at + length)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(0.16, at + length * 0.35)
  gain.gain.linearRampToValueAtTime(0, at + length)
  src.connect(filter).connect(gain).connect(out)
  src.start(at)
}

export function playOpenSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  try {
    // Let the chime play even when the iPhone's silent switch is on, like the background music does
    if (navigator.audioSession) navigator.audioSession.type = 'playback'
    const ctx = new AudioCtx()
    ctx.resume()
    const out = ctx.createGain()
    out.gain.value = 0.7
    out.connect(ctx.destination)
    const t = ctx.currentTime + 0.02
    bell(ctx, out, 659.25, t, 1) // E5
    bell(ctx, out, 987.77, t + 0.22, 0.7) // B5
    whoosh(ctx, out, t + 0.15, 1.1)
    setTimeout(() => ctx.close(), 3500)
  } catch {
    // sound is a nicety; never block opening the invitation
  }
}
