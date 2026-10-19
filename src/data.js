// All invitation content lives here — edit this file to change names, dates or venue.

export const wedding = {
  groom: {
    name: 'Abhishek Kashyap',
    shortName: 'Abhishek',
    father: 'Vijay Kumar Jha',
    mother: 'Madhu Devi',
  },
  bride: {
    name: 'Sumedha Kumari',
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

  // Events in order. `date` is ISO (YYYY-MM-DD); add `time: '10:30'` (24h) when known, and `endTime` for a range.
  // Add `venue: { name, address }` to an event held somewhere other than the main venue.
  // The event marked `main` is used for the countdown and the scratch-to-reveal date.
  events: [
    {
      title: 'Shagun',
      date: '2026-11-26',
      time: '13:00',
      icon: 'kalash',
      note: 'The auspicious beginning of our celebrations',
      venue: { name: 'Our Sweet Home', address: 'Kharsand, Hayaghat, Samastipur' },
    },
    {
      title: 'Haldi & Mehndi',
      date: '2026-11-26',
      time: '17:00',
      endTime: '22:00',
      icon: 'mehndi',
      note: 'Turmeric, henna, music & a lot of love',
      venue: { name: 'Our Sweet Home', address: 'Kharsand, Hayaghat, Samastipur' },
    },
    {
      title: 'Wedding',
      date: '2026-11-30',
      time: '20:00',
      icon: 'rings',
      note: 'Two hearts, one journey — the sacred vows',
      main: true,
    },
  ],

  // RSVP wishes are sent to this WhatsApp number (with country code, digits only)
  whatsapp: '919631061371',

  // Background music (starts when the envelope is opened). Set to '' to disable.
  // To change the song, put a file in public/ and update music + musicCredit.
  music: '/Kudmayi.mp3',
  musicCredit: 'Kudmayi — Rocky Aur Rani Kii Prem Kahaani',

  hashtag: '#AbhishekWedsSumedha',

  // Sanskrit verses: one on the entry envelope, one under the Ganesha invocation on the front page,
  // and one in the closing section
  shlokas: {
    entry: ['मङ्गलं भगवान् विष्णुः', 'मङ्गलं गरुडध्वजः ।', 'मङ्गलं पुण्डरीकाक्षः', 'मङ्गलायतनो हरिः ॥'],
    front: ['वक्रतुण्ड महाकाय', 'सूर्यकोटि समप्रभ ।', 'निर्विघ्नं कुरु मे देव', 'सर्वकार्येषु सर्वदा ॥'],
    closing: {
      lines: ['समञ्जन्तु विश्वे देवाः', 'समापो हृदयानि नौ ॥'],
      meaning: 'May all the divine powers unite our hearts as one',
      source: 'Rig Veda 10.85.47',
    },
  },
}
