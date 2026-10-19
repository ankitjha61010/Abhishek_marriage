// All invitation content lives here — edit this file to change names, dates or venue.

export const wedding = {
  groom: {
    name: 'Abhishek Kashyap',
    shortName: 'Abhishek',
    father: 'Vijay Kumar Jha',
    mother: 'Madhu Devi',
  },
  bride: {
    name: 'Sumedha',
    shortName: 'Sumedha',
    father: 'Vinod Kumar',
    mother: 'Neera Kumari',
  },

  // Shown in the "With love & blessings" family section
  groomFamily: [
    { relation: 'Brother', name: 'Aditya Kashyap' },
    { relation: 'Sister-in-law', name: 'Madhusmita Kashyap' },
  ],
  brideFamily: [{ relation: 'Brother', name: 'Harsh Kumar' }],

  venue: {
    name: 'Maheshwari Vivah Bhawan',
    address: 'Darbhanga, Bihar',
    // Exact map pin, e.g. { lat: 26.1542, lng: 85.8918 } (in Google Maps: long-press the venue → copy the numbers).
    // Without it, directions still work by name; with it, guests also see how far they are.
    coords: null,
  },

  // Events in order. `date` is ISO (YYYY-MM-DD); add `time: '10:30'` (24h) when known.
  // The event marked `main` is used for the countdown and the scratch-to-reveal date.
  events: [
    {
      title: 'Sagun',
      date: '2026-11-26',
      icon: 'kalash',
      note: 'The auspicious beginning of our celebrations',
    },
    {
      title: 'Haldi & Mehndi',
      date: '2026-11-26',
      icon: 'mehndi',
      note: 'Turmeric, henna, music & a lot of love',
    },
    {
      title: 'Wedding',
      date: '2026-11-30',
      icon: 'rings',
      note: 'Two hearts, one journey — the sacred vows',
      main: true,
    },
  ],

  // RSVP wishes are sent to this WhatsApp number (with country code, digits only)
  whatsapp: '919631061371',

  // Background music (starts when the envelope is opened). Set to '' to disable.
  // To change the song, put a file in public/ and update music + musicCredit.
  music: '/shehnai.m4a',
  musicCredit:
    'Benarasi Dhun — Shehnai by Ustad Bismillah Khan (excerpt). Archives of Sangeet Natak Akademi, New Delhi, CC BY-NC 4.0',

  hashtag: '#AbhishekWedsSumedha',
}
