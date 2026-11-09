# KashWay Tour & Travels website

The website for **KashWay Tour & Travels** (kashway.in), a Srinagar travel company recognised by the J&K Tourism Department.
*Discover Kashmir, the way it’s meant to be.*

## Stack

- Vite + React 18, React Router (clean URLs, code-split pages)
- Framer Motion for the motion system (page transitions, word reveals, clip-path image reveals, parallax, the horizontal seasons scroll)
- Leaflet + OpenStreetMap tiles for the interactive map (loaded only when the map scrolls into view)
- Self-hosted variable fonts: Newsreader (display/editorial) and Hanken Grotesk (UI/body)
- `sharp` image pipeline: AVIF, WebP and JPEG at two widths, blur placeholders, and content-hashed file names so hosts can cache photos for a year

```bash
npm install
npm run dev        # local development
npm run build      # production build in dist/ (includes a 404.html SPA fallback)
npm run images     # rebuild public/img from raw/ after adding or replacing photos
```

Hosting: any static host. `vercel.json` (Vercel) and `public/_redirects` (Cloudflare Pages / Netlify) send unknown paths to `index.html`.
`vercel.json` and `public/_headers` also tell browsers to keep photos and scripts cached for a year (safe because their names change whenever their content does).
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

## How photos load quickly

- The lead photo of the page being opened (home or a destination) starts downloading in `index.html`, at the same time as the JavaScript, instead of after it (see `vite.config.js`).
- Every photo is AVIF (WebP and JPEG as fallbacks) at the right width for the screen, with a blurred placeholder in its exact colours while it arrives.
- Photos further down start loading about a screen and a half before you reach them, so they are ready when you scroll to them.
- Hovering or pressing a photo starts fetching its full-size version, and the photo viewer fetches the photos either side of the one open.
- Photos already in the browser cache appear instantly, without a fade.

## The trip planner

Visitors tap a place (Srinagar, Gulmarg, …) and a planner opens on the spot, asking one question per screen:
what to arrange → when → how long → who’s coming → interests → **a day and time for a call** → name → phone → email → notes → review.
Single-choice answers move on automatically, every answer can be changed from the review screen, and the draft survives a page refresh.

How the enquiry is delivered depends on `src/config.js` (or the matching env vars):

| Setting | Effect |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | “Send on WhatsApp” opens WhatsApp with the whole enquiry written out |
| `VITE_FORM_ENDPOINT` | “Send enquiry” POSTs JSON to a form backend (Formspree, Web3Forms, a Worker…) and shows its real success or error |
| `VITE_ENQUIRY_EMAIL` | Adds “Email instead” |
| *(none set)* | Copies the enquiry and opens an Instagram DM to @kashway.in |

Nothing claims an enquiry was received unless a backend confirmed it.

## Before launch

1. **WhatsApp number** for `VITE_WHATSAPP_NUMBER` (the Instagram bio only shows a `wa.me/message/…` short link, which cannot carry a pre-filled message).
2. **Photography.** The current photos were supplied by KashWay and appear to be web downloads at about 736 px wide. Licences need confirming, and full-resolution originals will make the desktop hero much sharper. See `PHOTO-NOTES.md`.
3. **Real business content.** No prices, packages, testimonials, statistics or awards have been invented. Add them in `src/data/content.js` when KashWay provides them. The About story is written from the brand’s public profile and should be checked by KashWay.
4. **Map tiles.** OpenStreetMap’s public tile server suits low traffic only; set `VITE_TILE_URL` to a keyed provider for production.
5. Contour illustrations stand in for experiences that don’t have a photograph yet.
