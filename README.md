# Nucleus — Science Club Portal

A modern, highly engaging portal for the **BSSM Science Club** — built with React,
TypeScript and Tailwind CSS. "Warm-academic meets high-tech lab."

![Stack](https://img.shields.io/badge/React-19-61dafb) ![TS](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## Features

- **Sticky navbar** — brand logo, section links with scroll-spy, live "100+ Members
  Active" badge, Join Club CTA and a fully responsive mobile drawer.
- **Hero** — two-column split with an animated, interactive molecular-network
  `<canvas>` illustration, stats strip and twin action buttons.
- **Feature grid** — six club domains (Physics, Astronomy, Chemistry, Robotics,
  Bio-Engineering, Quantum) as hover-lift cards with soft-icon wrappers.
- **Projects & timeline tracker** — filter tabs (All / Robotics / Eco-Science /
  Space), progress bars, milestone timelines and contributor avatar stacks.
- **Announcement board** — featured fair banner plus notices with contextual
  `Live` / `Upcoming` / `Registration Open` status badges and interactive actions.
- **Join Us modal** — fully validated application form (inline errors, loading
  spinner, animated success state) with Escape / backdrop dismissal.
- **Footer** — multi-column links, socials, contact details and a working
  newsletter signup with its own validation + loading state.

## Tech stack

| Layer      | Choice                                       |
| ---------- | -------------------------------------------- |
| Framework  | React 19 (function components + hooks only)  |
| Language   | TypeScript (strict, `verbatimModuleSyntax`)  |
| Styling    | Tailwind CSS v4 (semantic `primary`/`accent` tokens) |
| Icons      | lucide-react                                 |
| Build      | Vite 7                                       |
| Font       | Inter Variable (self-hosted via Fontsource)  |

## Getting started

```bash
npm install
npm run dev      # start dev server on :5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
├── components/
│   ├── atoms/        # Button, Badge, Avatar, ProgressBar, Container, Reveal…
│   ├── molecules/    # FeatureCard, ProjectCard, NoticeCard, FormField, TimelineStrip…
│   └── organisms/    # Navbar, Hero, HeroCanvas, ProjectsSection, JoinModal, Footer…
├── context/          # JoinModal context (open/close state shared app-wide)
├── data/             # Typed content: features, projects, notices, gallery…
├── hooks/            # useScrollSpy, useLockBodyScroll
├── lib/              # Accent styles, validation helpers
└── types/            # Shared strict types (Project, Notice, Feature, Contributor…)
```

---

Made with ♥ by students, for students.
