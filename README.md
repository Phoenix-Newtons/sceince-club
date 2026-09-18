# Science Club BSSM — Website

> **Question boldly. Experiment fiercely. Discover together.**

A modern, interactive website for **Science Club BSSM**, built with React and
Vite. Created and maintained by **Luwangula Alpha** —
[alphaluwangula@proton.me](mailto:alphaluwangula@proton.me).

---

## Features

- **Hero** with club name, animated constellation canvas, count-up stats and CTAs
- **Sticky navigation** with scroll progress bar, active-section highlighting and a mobile menu
- **About** — mission, vision, values and the club's four pillars
- **Projects** — cards with **video previews that play on hover** (like YouTube previews);
  upcoming projects highlighted with a gradient ring
- **Events** — live countdown, event cards with one-click **Add to Google Calendar** links,
  plus an **embedded Google Calendar**
- **Blog / Journal** — full student-written articles with an in-page reader
- **Members** — profile cards for student leaders and contributors
- **The Idea Reactor** — a rotating display from a library of **1,000+ science quotes and
  "Did you know?" facts**, with daily picks, category filters, and a searchable library modal
- **Contact / Join form** wired to the club inbox via FormSubmit (with a mailto fallback)
- **Dark / light mode** toggle (remembers your choice, respects system preference)
- Fully **responsive** (mobile → tablet → desktop), smooth reveal animations,
  `prefers-reduced-motion` support
- Built with **React 18** and **lucide-react** icons

## Quick start

```bash
npm install
npm run dev       # development server on http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Customising the club's details

Almost everything lives in **one file**: [`src/config.js`](src/config.js)

| What                          | Where                                            |
| ----------------------------- | ------------------------------------------------ |
| Club name, tagline, email     | `src/config.js` → `SITE`                         |
| Social media links            | `src/config.js` → `SITE.socials`                 |
| Google Calendar embed         | `src/config.js` → `SITE.googleCalendarId`        |
| Timezone                      | `src/config.js` → `SITE.timezone`                |
| Members                       | `src/data/members.js` (avatars in `public/images/members/`) |
| Projects                      | `src/data/projects.js` (videos in `public/videos/`) |
| Events                        | `src/data/events.js`                             |
| Blog articles                 | `src/data/blog.js`                               |
| Quotes & facts library        | `src/data/facts/*.js`, `src/data/quotes/*.js`    |

The site reads the library size dynamically — add entries and every counter
updates automatically.

### Connecting the real club calendar

The Events section embeds Google's public *Phases of the Moon* calendar as a
working demo. To show the club's own meetings and fairs:

1. Open **Google Calendar → Settings → Integrate calendar** for the club calendar.
2. Make it public (*Settings and sharing → "Make available to public"*).
3. Paste the **Calendar ID** (looks like `abc123@group.calendar.google.com`)
   into `googleCalendarId` in `src/config.js`.

The "Add to Google Calendar" buttons on each event card work for every visitor
regardless of the embed.

### The contact form

The form POSTs to [`formsubmit.co`](https://formsubmit.co), which forwards
messages to **alphaluwangula@proton.me** — no backend needed. The **first**
submission ever triggers a one-time activation email to that inbox (check spam,
click once); everything afterwards is automatic. If the service is unreachable,
the form offers a `mailto:` fallback automatically.

### Project preview videos

The hover previews are 4-second loops generated with
`tools/make_videos.py` (numpy + ffmpeg — art, not stock footage). To regenerate
or restyle them, edit the script and run it; to use real footage, just drop
replacement `.mp4` + `.jpg` poster files into `public/videos/` with the same names.

## Deployment

Any static host works — build first (`npm run build`), then publish `dist/`:

- **Netlify / Vercel** — import the repo; build command `npm run build`, output `dist`
- **GitHub Pages** — set `base: '/<repo-name>/'` in `vite.config.js` first, then
  publish `dist/` (e.g. with the `gh-pages` package or a GitHub Action)

## Tech stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | React 18 + Vite 6                             |
| Icons     | [lucide-react](https://lucide.dev)            |
| Styling   | Hand-crafted CSS (custom properties, themes)  |
| Fonts     | Space Grotesk · Inter · JetBrains Mono        |
| Assets    | Procedurally generated videos & cover art (numpy + ffmpeg), AI-illustrated avatars/covers |

## License

GPL-3.0 — see [LICENSE](LICENSE). Built with ❤ and an unreasonable amount of
curiosity by **Luwangula Alpha**.
