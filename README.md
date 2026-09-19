# Nucleus — Science Club Portal

A modern, multi-page portal for the **BSSM Science Club** — React + TypeScript +
Tailwind CSS, with a real backend, member accounts, and light/dark theming.
"Warm-academic meets high-tech lab."

Created by **Luwangula Alpha** · [alphaluwangula@proton.me](mailto:alphaluwangula@proton.me)

## Pages

| Route       | What's on it                                                            |
| ----------- | ----------------------------------------------------------------------- |
| `/`         | Moving-starfield hero, club domains, rotating university-level facts, CTA |
| `/events`   | Featured event banner + notice board with Live/Upcoming/Registration badges |
| `/projects` | Filterable project tracker (Robotics / Eco-Science / Space) with timelines; members can publish projects |
| `/gallery`  | Visual highlights from the lab                                           |
| `/about`    | Mission, values, the live club quote, partners                           |
| `/admin`    | Sign-in + applications, member registration, projects, quotes, facts, notices management |

## Real data — no mocks

The frontend contains **zero hardcoded content**. Everything (projects, notices,
quotes, did-you-knows, members, applications, subscribers) is served by the
Express API and persisted to `server/data/db.json`. A fresh database is seeded
automatically on first boot and is fully editable/deletable from the admin panel.

**Default admin account** (seeded):

- Email: `alphaluwangula@proton.me`
- Password: `Nucleus-2026!` (override with the `ADMIN_PASSWORD` env var before first boot)

> Change this password for any real deployment — members are created from the
> admin panel or approved from public applications.

## Auth & roles

- **Visitors** can browse everything and submit join applications / newsletter signups.
- **Members** (signed in) can publish projects, add quotes and add did-you-knows.
- **Admins** can additionally register/remove members, approve or reject
  applications (issuing temporary passwords), post featured notices, and delete content.

Sessions are token-based (7-day expiry); passwords are scrypt-hashed.

## Tech stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Frontend   | React 19 (function components + hooks), React Router v7 |
| Language   | TypeScript (strict, `verbatimModuleSyntax`)          |
| Styling    | Tailwind CSS v4 — light **and** dark mode (class strategy) |
| Icons      | lucide-react                                         |
| Backend    | Express 5 + JSON file store (`server/data/db.json`)  |
| Font       | Inter Variable (self-hosted)                         |

## Getting started

```bash
npm install
npm run server   # API on http://localhost:4000 (seeds the DB on first run)
npm run dev      # frontend on http://localhost:5173 (proxies /api → :4000)
```

Production: `npm run build` then `npm run server` — the API also serves `dist/`
with SPA fallback, so one process serves everything.

## Project structure

```
├── server/            # Express API, JSON store, seeding, scrypt auth
└── src/
    ├── api/           # Typed fetch client (token handling)
    ├── components/
    │   ├── atoms/     # Button, Badge, Avatar, Skeleton, ThemeToggle…
    │   ├── molecules/ # Cards, form fields, avatar stacks, timelines…
    │   ├── organisms/ # Navbar, Hero + StarfieldCanvas, sections, modals…
    │   └── admin/     # Login + six admin panels
    ├── context/       # Theme (light/dark), Auth, JoinModal
    ├── data/          # Static editorial content (features, gallery, values)
    ├── hooks/         # useApi, useLockBodyScroll
    ├── lib/           # Accent styles, validation
    ├── pages/         # Home, Events, Projects, Gallery, About, Admin, 404
    └── types/         # Shared strict types
```
