// Business settings. Everything KashWay still has to confirm lives here,
// so going live is a one-file change. See README "Before launch".

export const BRAND = {
  name: 'KashWay',
  legalName: 'KashWay Tour & Travels',
  tagline: 'Discover Kashmir, the way it’s meant to be.',
  teaser: 'Kashmir is about to be experienced differently.',
  offer: ['Tours', 'Stays', 'Experiences'],
  recognition: 'Recognised by the J&K Tourism Department',
  city: 'Srinagar, Jammu & Kashmir',
  url: 'https://kashway.in',
  instagram: 'https://www.instagram.com/kashway.in/',
  instagramHandle: '@kashway.in',
  // Opens an Instagram direct-message thread with the account.
  instagramDM: 'https://ig.me/m/kashway.in',
};

// KashWay's WhatsApp business chat link (from the WhatsApp Business app).
// A wa.me/message/… link opens the chat but cannot carry text of its own,
// so the trip planner copies the enquiry first and asks the traveller to
// paste it into the chat.
export const WHATSAPP_LINK = import.meta.env.VITE_WHATSAPP_LINK || 'https://wa.me/message/JP7YQVJ6WYF4K1';

// KashWay's WhatsApp number in international format, digits only,
// e.g. '9197XXXXXXXX'. When set, it takes over from the link above and the
// enquiry is written straight into the WhatsApp message, ready to send.
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');

// Where the "Message us on WhatsApp" links point.
export const WHATSAPP_CHAT = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : WHATSAPP_LINK;

// Public email for enquiries.
export const ENQUIRY_EMAIL = import.meta.env.VITE_ENQUIRY_EMAIL || 'contactkashway@gmail.com';

// Optional form backend (Formspree, Web3Forms, a Cloudflare Worker…).
// When set, the planner POSTs the enquiry as JSON and shows the real
// success or error returned by that endpoint.
export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';

// Map tiles. OpenStreetMap's public tiles suit low traffic; for production
// traffic set a keyed provider (MapTiler, Stadia, Thunderforest) here.
export const TILE_URL =
  import.meta.env.VITE_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION =
  import.meta.env.VITE_TILE_ATTRIBUTION ||
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
