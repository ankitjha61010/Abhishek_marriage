import { useEffect, useRef, useState } from 'react'
import { wedding } from './data'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import ScratchHeart from './components/ScratchHeart'
import Countdown from './components/Countdown'
import { Confetti, FallingPetals, Reveal } from './components/Effects'
import { Divider, EmbossedLeaves, Heart, icons, tileVars } from './components/Ornaments'

const toDate = (iso, time = '00:00') => {
  const [y, m, d] = iso.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm)
}
const fmtLong = (date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
const fmtDay = (date) => date.toLocaleDateString('en-IN', { weekday: 'long' })
const fmtTime = (date) => date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })

function downloadCalendar() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const vevents = wedding.events.map((ev, i) => {
    const day = ev.date.replace(/-/g, '')
    const place = ev.venue ?? wedding.venue
    const next = toDate(ev.date)
    next.setDate(next.getDate() + 1)
    const end = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`
    const when = ev.time
      ? `DTSTART:${day}T${ev.time.replace(':', '')}00`
      : `DTSTART;VALUE=DATE:${day}\r\nDTEND;VALUE=DATE:${end}`
    return [
      'BEGIN:VEVENT',
      `UID:${day}-${i}@abhishek-sumedha`,
      `DTSTAMP:${stamp}`,
      when,
      `SUMMARY:${ev.title} · ${wedding.groom.shortName} & ${wedding.bride.shortName}`,
      `LOCATION:${place.name}${place.address ? ', ' + place.address : ''}`,
      'END:VEVENT',
    ].join('\r\n')
  })
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//shadicard//EN', ...vevents, 'END:VCALENDAR'].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: 'abhishek-sumedha.ics' })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Google Maps directions from the guest's current location to the venue (distance, time & "Start")
const venueTarget = (v) => (v.coords ? `${v.coords.lat},${v.coords.lng}` : `${v.name}, ${v.address}`)
const directionsUrl = (v) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueTarget(v))}&travelmode=driving`

const distanceKm = (a, b) => {
  const rad = (d) => (d * Math.PI) / 180
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

function VenueDistance({ coords }) {
  const [state, setState] = useState({ status: 'idle' })

  const locate = () => {
    if (!navigator.geolocation) return setState({ status: 'error', text: 'Location is not available on this device.' })
    setState({ status: 'loading' })
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        const km = distanceKm({ lat: c.latitude, lng: c.longitude }, coords)
        setState({ status: 'done', text: `You are about ${km < 10 ? km.toFixed(1) : Math.round(km)} km away` })
      },
      () => setState({ status: 'error', text: 'Allow location access to see the distance.' }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  if (state.status === 'done' || state.status === 'error') return <p className="venue-distance">{state.text}</p>
  return (
    <button type="button" className="link-btn" onClick={locate} disabled={state.status === 'loading'}>
      {state.status === 'loading' ? 'Finding your location…' : 'How far am I from the venue?'}
    </button>
  )
}

function SectionTitle({ icon, children }) {
  return (
    <div className="section-title">
      {icon && <div className="section-icon">{icon}</div>}
      <h2 className="script">{children}</h2>
      <Divider />
    </div>
  )
}

function Rsvp() {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState('yes')
  const [message, setMessage] = useState('')

  const send = (e) => {
    e.preventDefault()
    const text = [
      `Dear ${wedding.groom.shortName} & ${wedding.bride.shortName},`,
      attending === 'yes'
        ? 'We will joyfully be there to celebrate with you! 🎉'
        : 'We are sorry we can’t make it, but our blessings are with you. 💐',
      message && `\n${message}`,
      `\n— ${name || 'With love'}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(`https://wa.me/${wedding.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <form className="rsvp" onSubmit={send}>
      <label>
        <span>Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
      </label>
      <div className="rsvp-choice" role="radiogroup" aria-label="Will you attend?">
        {[
          ['yes', 'Joyfully accept'],
          ['no', 'Regretfully decline'],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            role="radio"
            aria-checked={attending === value}
            className={attending === value ? 'is-active' : ''}
            onClick={() => setAttending(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <label>
        <span>Your wishes</span>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a blessing for the couple…"
        />
      </label>
      <button type="submit" className="btn btn--olive btn--block">
        Send Message
      </button>
    </form>
  )
}

function MusicToggle({ audioRef }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const a = audioRef.current
    const sync = () => setOn(!a.paused)
    a.addEventListener('play', sync)
    a.addEventListener('pause', sync)
    return () => {
      a.removeEventListener('play', sync)
      a.removeEventListener('pause', sync)
    }
  }, [audioRef])
  const toggle = () => (audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause())
  return (
    <button
      className="music-toggle"
      onClick={toggle}
      aria-label={on ? 'Mute music' : 'Play music'}
      title={wedding.musicCredit ? `♪ ${wedding.musicCredit}` : undefined}
    >
      {on ? icons.soundOn : icons.soundOff}
    </button>
  )
}

export default function App() {
  const [opened, setOpened] = useState(false)
  const [envelopeGone, setEnvelopeGone] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const audioRef = useRef(null)
  const { groom, bride, venue, events } = wedding

  const mainEvent = events.find((ev) => ev.main) ?? events[0]
  const mainDate = toDate(mainEvent.date, mainEvent.time)
  const mainAhead = mainDate > new Date()

  useEffect(() => {
    document.body.style.overflow = envelopeGone ? '' : 'hidden'
  }, [envelopeGone])

  const handleOpen = () => {
    setOpened(true)
    const audio = audioRef.current
    if (!audio) return
    // fade in gently instead of starting at full volume
    audio.volume = 0
    audio.play().catch(() => {})
    const fade = setInterval(() => {
      audio.volume = Math.min(0.6, audio.volume + 0.03)
      if (audio.volume >= 0.6) clearInterval(fade)
    }, 120)
  }

  return (
    <div className="page" style={tileVars}>
      <div className="backdrop" aria-hidden="true">
        <EmbossedLeaves />
      </div>
      {wedding.music && <audio ref={audioRef} src={wedding.music} loop preload="auto" />}
      {!envelopeGone && <Envelope onOpen={handleOpen} onDone={() => setEnvelopeGone(true)} />}
      <Confetti fire={confetti} />

      <main className="card">
        {wedding.music && <MusicToggle audioRef={audioRef} />}
        <Hero play={opened} />

        <div className="paper linen">
          <div className="vine vine--left" aria-hidden="true" />
          <div className="vine vine--right" aria-hidden="true" />

          <Reveal as="section" className="section welcome">
            <Divider wide />
            <p className="welcome-text">
              We are honored to welcome you to the wedding ceremony of{' '}
              <em>
                {groom.shortName} &amp; {bride.shortName}
              </em>
              . As they begin their journey together in faith and love, we thank you for being part of this blessed
              occasion <Heart size={14} className="inline-heart" />
            </p>
            <Divider wide />
          </Reveal>

          <section className="section forever">
            <FallingPetals />
            <Reveal>
              <h2 className="script forever-title">Our forever begins</h2>
              <Divider />
            </Reveal>
            <Reveal>
              <p className="scratch-caption script">Scratch to Reveal</p>
              <ScratchHeart onReveal={() => setConfetti(true)}>
                <p className="heart-kicker">You&rsquo;re Invited!</p>
                <p className="heart-date">{fmtLong(mainDate)}</p>
                <p className="heart-day">{fmtDay(mainDate)}</p>
                <p className="heart-event">{mainEvent.title} Ceremony</p>
              </ScratchHeart>
            </Reveal>
            <Reveal>
              <button className="btn btn--olive save-date" onClick={downloadCalendar}>
                {icons.calendar}
                <span>Save the Date</span>
              </button>
            </Reveal>
          </section>

          <Reveal as="section" className="section">
            <p className="eyebrow">Counting down to</p>
            <h2 className="script countdown-title">{mainAhead ? `Our ${mainEvent.title}` : 'Forever'}</h2>
            <Divider />
            {mainAhead ? (
              <Countdown target={mainDate.getTime()} />
            ) : (
              <p className="body-text">The celebrations have begun — thank you for being with us!</p>
            )}
          </Reveal>

          <Reveal as="section" className="section">
            <SectionTitle icon={icons.clock}>Program Timeline</SectionTitle>
            <ol className="timeline">
              {events.map((ev) => {
                const d = toDate(ev.date, ev.time)
                const place = ev.venue ?? venue
                return (
                  <li key={ev.title} className="timeline-item">
                    <span className="timeline-dot">{icons[ev.icon]}</span>
                    <h3>{ev.title}</h3>
                    <p className="timeline-date">
                      {fmtDay(d)}, {fmtLong(d)}
                      {ev.time && ` · ${fmtTime(d)}`}
                    </p>
                    <p className="timeline-note">
                      {ev.note} <Heart size={11} className="inline-heart" />
                    </p>
                    <p className="timeline-venue">
                      {icons.pin}
                      <span>
                        <span className="timeline-venue-name">{place.name}</span>
                        {place.address && <span className="timeline-venue-address">{place.address}</span>}
                      </span>
                    </p>
                  </li>
                )
              })}
            </ol>
          </Reveal>

          <Reveal as="section" className="section">
            <SectionTitle icon={icons.pin}>The Venue</SectionTitle>
            <p className="venue-name">{venue.name}</p>
            {venue.address && <p className="body-text">{venue.address}</p>}
            <a className="btn btn--olive" href={directionsUrl(venue)} target="_blank" rel="noreferrer">
              {icons.navigate}
              <span>Get Directions</span>
            </a>
            <p className="venue-hint">Opens Google Maps from your current location with distance &amp; route</p>
            {venue.coords && <VenueDistance coords={venue.coords} />}
          </Reveal>

          <Reveal as="section" className="section">
            <SectionTitle icon={icons.family}>With Love &amp; Blessings</SectionTitle>
            <p className="body-text">Eagerly awaiting your gracious presence</p>
            <div className="families">
              {[
                ["Groom's Family", groom, wedding.groomFamily],
                ["Bride's Family", bride, wedding.brideFamily],
              ].map(([title, person, members]) => (
                <div key={title} className="family-card">
                  <h3>{title}</h3>
                  <p className="family-parents">
                    Mr. {person.father}
                    <br />
                    &amp; Mrs. {person.mother}
                  </p>
                  <Divider />
                  <ul>
                    {members.map((m) => (
                      <li key={m.name}>
                        <span className="family-name">{m.name}</span>
                        <span className="family-relation">{m.relation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="section">
            <SectionTitle icon={icons.letter}>Send Your Wishes</SectionTitle>
            <Rsvp />
          </Reveal>

          <Reveal as="section" className="section closing">
            <Divider wide />
            <h2 className="script closing-title">
              We can&rsquo;t wait to
              <br />
              celebrate with you!
            </h2>
            <p className="script closing-names">
              {groom.shortName} &amp; {bride.shortName}
            </p>
            <Divider wide />
            <p className="shloka shloka--closing">
              {wedding.shlokas.closing.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className="shloka-meaning">
              {wedding.shlokas.closing.meaning}
              <span>— {wedding.shlokas.closing.source}</span>
            </p>
            <p className="hashtag">{wedding.hashtag}</p>
          </Reveal>
        </div>
      </main>
    </div>
  )
}
