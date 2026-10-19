# Abhishek & Sumedha — Wedding Invitation

Animated, responsive wedding card (React + Vite).

Flow: olive envelope → tap seal → doors open → curtains part → names → scroll through
welcome note, scratch-to-reveal date, countdown, program timeline, venue, family, wishes (WhatsApp).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/ — deploy to Netlify, Vercel, GitHub Pages, etc.
```

## Edit content

Everything (names, family, events, venue, map link, hashtag, music) is in `src/data.js`.

- Add the wedding day / reception as more entries in `events` (add `time: '19:00'` when known).
- Background music: put an mp3 in `public/` and set `music: '/music.mp3'`.
