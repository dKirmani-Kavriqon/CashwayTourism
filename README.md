# KashWay Tour & Travels website

The website for **KashWay Tour & Travels** (kashway.in), a Srinagar travel company recognised by the J&K Tourism Department.
*Discover Kashmir, the way it’s meant to be.*

## Stack

- Vite + React 18, React Router (clean URLs, code-split pages)
- Framer Motion for the motion system (page transitions, word reveals, clip-path image reveals, parallax, the horizontal seasons scroll)
- Leaflet + OpenStreetMap tiles for the interactive map (loaded only when the map scrolls into view). Every place has a photo: a small preview pops up on hover or keyboard focus, and selecting a place opens a card whose photo enlarges into the full-screen viewer
- Self-hosted variable fonts: Newsreader (display/editorial) and Hanken Grotesk (UI/body)
- `sharp` image pipeline: AVIF and WebP (no JPEG photos) at up to three widths, plus blur placeholders and JPEG link-preview cards

```bash
npm install
npm run dev        # local development
npm run build      # production build in dist/: every page prerendered with its own share tags, plus 404.html and sitemap.xml
npm run images     # rebuild public/img from raw/ after adding or replacing photos
npm run og         # redraw the link-preview cards in public/og/ (needs Playwright + Chromium)
```

Hosting: any static host. `vercel.json` (Vercel) serves each page's prerendered HTML and sends unknown paths to `index.html`; `public/_redirects` does the latter on Cloudflare Pages / Netlify.

## Search and share metadata

All titles, descriptions, share cards and structured data live in `src/data/seo.js`.

- **Link previews.** WhatsApp, Facebook, LinkedIn and X don't run JavaScript, so `scripts/prerender-seo.mjs` writes each page's tags into its own HTML file at build time (`dist/gallery/index.html`, `dist/destinations/gulmarg/index.html`, …). The same values are applied in the browser as people move between pages.
- **Tags per page.** Title, description, canonical URL, robots, Open Graph (type, URL, title, description, image with size, type and alt text) and X/Twitter large-image cards.
- **Share cards.** A 1200×630 card for every page and destination, with the page's photo, its headline in the site's fonts, the KashWay logo and the J&K Tourism recognition (`public/og/`).
- **Structured data (JSON-LD).** The business (`TravelAgency`: address, phone, email, WhatsApp, Instagram, the places it serves) and the `WebSite` on every page. Each destination adds a `TouristDestination` with its sights and a `BreadcrumbList`, and the guide adds a `FAQPage`.
- **Also included.** `sitemap.xml` (generated, with each page's images), `robots.txt`, a web app manifest and icons (32, 180, 192 and 512 px), and geo tags for Srinagar.

The share links point at `https://kashway.in`, so previews show once the domain serves this site. Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) refreshes a cached preview.
`VITE_ROUTER=hash npm run build` makes a copy that runs from any file host without rewrites (used for previews).

## Pages

| Path | What it is |
| --- | --- |
| `/` | Cinematic hero, statement, four-seasons horizontal scroll, featured destinations, experience index, gallery strip, sample routes, map, why KashWay, trip planner |
| `/destinations` | Search + season/type filters, editorial grid, full map |
| `/destinations/:slug` | Srinagar, Gulmarg, Sonamarg, Pahalgam, Doodhpathri, Yusmarg: hero, facts, story, top sights, things to do, best time, culture/food/stay, tips, local map, routes, nearby |
| `/experiences` | 14 experiences, filter by category (`?c=food` etc. deep-links) |
| `/guides` | Six-chapter travel guide with sticky contents and FAQ (FAQPage structured data) |
| `/gallery` | Filterable gallery that opens the zoomable photo viewer |
| `/about` | Story, mission, vision, what makes KashWay different, photo credits |
| `/plan` | Destination tiles that open the planner; `?to=gulmarg` opens it pre-filled |

## Design notes (Apple Human Interface Guidelines)

The look follows the HIG, adapted for the web:

- **Smooth corners.** Photos and cards use a small set of radius tokens (`--r-xl`, `--r-lg`, `--r-md`, `--r-sm` in `base.css`), with nested shapes kept concentric. Browsers that support `corner-shape` get continuous “squircle” corners like iOS.
- **Glass only on controls.** The nav lifts into a floating glass capsule once you scroll; the phone bottom bar, menus, map card and photo-viewer controls use the same material. Photos and text are never put behind glass. Reduced transparency and increased contrast swap the glass for solid fills.
- **Thumb reach on phones.** On small screens “Plan your trip” moves to a bottom bar that steps aside while you read and returns when you scroll up. The planner opens as a sheet with rounded top corners, and safe areas are respected.
- **Photo viewer.** Tap any photo to open it full screen. It grows out of the photo you tapped. Pinch, double-tap, click, scroll or trackpad-pinch to zoom; drag to pan; swipe sideways to move between photos and swipe down to close. Every gesture also has a button or key (Zoom, arrows, Close, `Esc`, `+` `-` `0`), and reduced motion swaps the movement for fades. See `src/components/PhotoViewer.jsx`.

## The trip planner

Visitors tap a place (Srinagar, Gulmarg, …) and a planner opens on the spot, asking one question per screen:
what to arrange → when → how long → who’s coming → interests → **a day and time for a call** → name → phone → email → notes → review.
Single-choice answers move on automatically, every answer can be changed from the review screen, and the draft survives a page refresh.

How the enquiry is delivered depends on `src/config.js` (or the matching env vars):

| Setting | Effect |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` (default: KashWay’s +91 70061 09364) | “Send on WhatsApp” opens a chat with KashWay with the whole enquiry already typed into the message, so the traveller only presses send |
| `VITE_WHATSAPP_LINK` | Only used if the number is cleared: copies the enquiry and opens KashWay’s `wa.me/message/…` business link for the traveller to paste it, since those links can’t carry text |
| `VITE_FORM_ENDPOINT` | “Send enquiry” POSTs JSON to a form backend (Formspree, Web3Forms, a Worker…) and shows its real success or error |
| `VITE_ENQUIRY_EMAIL` (default: contactkashway@gmail.com) | Adds “Email instead”, and shows the address in the footer, menu and Plan page |
| *(no WhatsApp at all)* | Copies the enquiry and opens an Instagram DM to @kashway.in |

Nothing claims an enquiry was received unless a backend confirmed it.

## Before launch

1. **Photography.** The current photos were supplied by KashWay and appear to be web downloads at about 736 px wide. Licences need confirming, and full-resolution originals will make the desktop hero much sharper. See `PHOTO-NOTES.md`.
2. **Real business content.** No prices, packages, testimonials, statistics or awards have been invented. Add them in `src/data/content.js` when KashWay provides them. The About story is written from the brand’s public profile and should be checked by KashWay.
3. **Map tiles.** OpenStreetMap’s public tile server suits low traffic only; set `VITE_TILE_URL` to a keyed provider for production.
4. Every experience and map place now has a photograph. Contour illustrations remain as the fallback for any new one added without a photo.
