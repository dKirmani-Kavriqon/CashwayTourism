// Search and share metadata for every page, in one place.
// Used three ways:
//   1. useSeo() updates the <head> as people move around the site;
//   2. scripts/prerender-seo.mjs writes each page's tags into its own static
//      HTML at build time, because WhatsApp, Facebook, LinkedIn and X read
//      link previews without running JavaScript;
//   3. scripts/build-og.mjs draws the 1200×630 share card for each page.
// Plain data only (no import.meta.env), so Node scripts can import it too.

import { DESTINATIONS, DEST_BY_SLUG, PHOTOS } from './content.js';
import { FAQS } from './guides.js';

export const SITE = {
  url: 'https://kashway.in',
  name: 'KashWay',
  legalName: 'KashWay Tour & Travels',
  tagline: 'Discover Kashmir, the way it’s meant to be.',
  locale: 'en_IN',
  email: 'contactkashway@gmail.com',
  phone: '+917006109364',
  instagram: 'https://www.instagram.com/kashway.in/',
  whatsapp: 'https://wa.me/917006109364',
  logo: '/logo-256.png',
  recognition: 'Recognised by the J&K Tourism Department',
  geo: { lat: 34.0837, lng: 74.7973 },
};

const OG_W = 1200;
const OG_H = 630;

const AGENCY_ID = `${SITE.url}/#agency`;
const agencyRef = { '@id': AGENCY_ID };

/** Site-wide structured data: the business and the website. */
export const SITE_JSONLD = [
  {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': AGENCY_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: SITE.url + SITE.logo,
    image: `${SITE.url}/og/home.jpg`,
    slogan: SITE.tagline,
    description: 'Tours, stays and experiences across Kashmir, planned from Srinagar. ' + SITE.recognition + '.',
    email: SITE.email,
    telephone: SITE.phone,
    address: { '@type': 'PostalAddress', addressLocality: 'Srinagar', addressRegion: 'Jammu and Kashmir', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    areaServed: [
      { '@type': 'Place', name: 'Kashmir Valley' },
      ...DESTINATIONS.map((d) => ({ '@type': 'Place', name: `${d.name}, Kashmir` })),
    ],
    contactPoint: [{
      '@type': 'ContactPoint', contactType: 'customer service', telephone: SITE.phone, email: SITE.email,
      areaServed: 'IN',
    }],
    sameAs: [SITE.instagram, SITE.whatsapp],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.legalName,
    inLanguage: 'en-IN',
    publisher: agencyRef,
  },
];

// The share card for each page: the photo behind it and the words on it.
const PAGES = {
  '/': {
    title: null,
    description: 'KashWay Tour & Travels plans tours, stays and experiences across Kashmir: Dal Lake houseboats, Gulmarg snow, Sonamarg glaciers and the meadows of Pahalgam. Based in Srinagar.',
    card: { key: 'home', photo: 'dal-autumn', eyebrow: 'Tours · Stays · Experiences', headline: ['Discover Kashmir,', 'the way it’s meant to be.'] },
  },
  '/destinations': {
    title: 'Destinations in Kashmir',
    description: 'Srinagar, Gulmarg, Sonamarg, Pahalgam, Doodhpathri and Yusmarg: when to go, what to do and where to stay, with an interactive map.',
    card: { key: 'destinations', photo: 'betaab-valley', eyebrow: 'Destinations', headline: ['Six valleys,', 'one Kashmir.'] },
  },
  '/experiences': {
    title: 'Experiences in Kashmir',
    description: 'Dawn shikaras, the Gulmarg Gondola, skiing, houseboat nights, craft lanes, wazwan, noon chai, Lidder rafting, meadow days, the Great Lakes trek and tulip season. Filter Kashmir experiences by what you love.',
    card: { key: 'experiences', photo: 'gulmarg-skiing', eyebrow: 'Experiences', headline: ['Not just places.', 'Moments.'] },
  },
  '/guides': {
    title: 'Kashmir travel guide',
    description: 'When to visit Kashmir, how to get there and get around, local customs, what to pack, phones and money, and answers to common questions.',
    card: { key: 'guides', photo: 'hazratbal', eyebrow: 'The KashWay travel guide', headline: ['Before', 'you go.'] },
    jsonLd: {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  },
  '/gallery': {
    title: 'Gallery',
    description: 'Photographs of Kashmir: the Great Lakes trek, Dal Lake, Hazratbal, Jamia Masjid, the Mughal gardens, the Tulip Garden, skiing in Gulmarg, Aru and Betaab valleys, Thajiwas, Doodhpathri, Yusmarg, noon chai and wazwan.',
    card: { key: 'gallery', photo: 'great-lakes', eyebrow: 'Gallery', headline: ['The valley,', 'frame by frame.'] },
  },
  '/about': {
    title: 'About KashWay',
    description: 'KashWay Tour & Travels is a Srinagar travel company recognised by the J&K Tourism Department, planning tours, stays and experiences across Kashmir.',
    card: { key: 'about', photo: 'shalimar-bagh', eyebrow: 'About KashWay', headline: ['Kashmir is about to be', 'experienced differently.'] },
  },
  '/plan': {
    title: 'Plan your Kashmir trip',
    description: 'Tell KashWay where you want to go in Kashmir. Pick a place, answer a few quick questions, and send your trip straight to our Srinagar team on WhatsApp.',
    card: { key: 'plan', photo: 'nishat-bagh', eyebrow: 'Plan your trip', headline: ['Where do you want', 'to wake up?'] },
  },
};

const NOT_FOUND = {
  title: 'Page not found',
  description: 'This page doesn’t exist. Find your way back to KashWay’s Kashmir destinations.',
  card: { key: 'home', photo: 'dal-autumn' },
  noindex: true,
};

function destinationPage(d) {
  return {
    title: `${d.name}, Kashmir`,
    description: `${d.name} (${d.meaning.toLowerCase()}): ${d.lede}`,
    card: { key: `dest-${d.slug}`, photo: d.image, eyebrow: `${d.meaning} · ${d.altitude}`, headline: [d.name] },
    type: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org', '@type': 'TouristDestination', name: `${d.name}, Kashmir`,
        description: d.lede, url: `${SITE.url}/destinations/${d.slug}`,
        image: `${SITE.url}/og/dest-${d.slug}.jpg`,
        geo: { '@type': 'GeoCoordinates', latitude: d.coords[0], longitude: d.coords[1] },
        containedInPlace: { '@type': 'AdministrativeArea', name: 'Jammu and Kashmir, India' },
        includesAttraction: d.attractions.map((a) => ({ '@type': 'TouristAttraction', name: a.name, description: a.note })),
        provider: agencyRef,
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
          { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE.url}/destinations` },
          { '@type': 'ListItem', position: 3, name: d.name, item: `${SITE.url}/destinations/${d.slug}` },
        ],
      },
    ],
  };
}

/** Every page that gets its own prerendered HTML and share card. */
export const SEO_ROUTES = [...Object.keys(PAGES), ...DESTINATIONS.map((d) => `/destinations/${d.slug}`)];

/** Every share card to draw: { key, photo, eyebrow, headline }. */
export const OG_CARDS = SEO_ROUTES.map((p) => pageFor(p).card);

function pageFor(path) {
  if (PAGES[path]) return PAGES[path];
  const m = path.match(/^\/destinations\/([^/]+)$/);
  if (m && DEST_BY_SLUG[m[1]]) return destinationPage(DEST_BY_SLUG[m[1]]);
  return NOT_FOUND;
}

/** Resolved metadata for a path: everything the <head> needs. */
export function seoFor(path) {
  const page = pageFor(path);
  const notFound = page === NOT_FOUND;
  const canonicalPath = notFound ? '/404' : path;
  const fullTitle = page.title ? `${page.title} · ${SITE.name}` : `${SITE.legalName} · ${SITE.tagline.replace(/\.$/, '')}`;
  const photo = PHOTOS[page.card.photo];
  return {
    path: canonicalPath,
    url: SITE.url + (canonicalPath === '/' ? '/' : canonicalPath),
    title: fullTitle,
    description: page.description,
    type: page.type || 'website',
    image: `${SITE.url}/og/${page.card.key}.jpg`,
    imageAlt: photo ? `${photo.alt}. ${SITE.legalName}.` : SITE.legalName,
    imageWidth: OG_W,
    imageHeight: OG_H,
    noindex: !!page.noindex,
    jsonLd: [].concat(page.jsonLd || []),
  };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The <head> tags for a page, as HTML (used when prerendering). */
export function headTags(path) {
  const s = seoFor(path);
  const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
  return [
    `<title>${esc(s.title)}</title>`,
    `<meta name="description" content="${esc(s.description)}" />`,
    `<meta name="robots" content="${s.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${esc(s.url)}" />`,
    `<meta property="og:type" content="${s.type}" />`,
    `<meta property="og:site_name" content="${esc(SITE.legalName)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:url" content="${esc(s.url)}" />`,
    `<meta property="og:title" content="${esc(s.title)}" />`,
    `<meta property="og:description" content="${esc(s.description)}" />`,
    `<meta property="og:image" content="${esc(s.image)}" />`,
    `<meta property="og:image:secure_url" content="${esc(s.image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="${s.imageWidth}" />`,
    `<meta property="og:image:height" content="${s.imageHeight}" />`,
    `<meta property="og:image:alt" content="${esc(s.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(s.title)}" />`,
    `<meta name="twitter:description" content="${esc(s.description)}" />`,
    `<meta name="twitter:image" content="${esc(s.image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(s.imageAlt)}" />`,
    ...SITE_JSONLD.map((o) => `<script type="application/ld+json">${json(o)}</script>`),
    ...s.jsonLd.map((o) => `<script type="application/ld+json" data-page="1">${json(o)}</script>`),
  ].join('\n    ');
}
