# Portfolio

An interactive portfolio for a Computer Science / ML student.
Built with Vite + React + TypeScript, react-three-fiber (Three.js),
Framer Motion, and Tailwind CSS.

## Features

- **Boot sequence intro** — a terminal-style boot log, then the name lands
- **Holographic photo album** — a faceted shell dissolves as the cursor
  approaches, revealing photos suspended throughout a glowing particle core
- **Scroll sequence** — the core shrinks and descends as you scroll, blooms on
  arrival, then the navigation nodes fan out of it
- **Node navigation** — sections open as overlay panels, so the scene is never
  torn down
- Editorial design system: hairline rules, numbered rows, monospace metadata
  (no card grids, pill badges, or hover lifts)
- Working contact form with validation + a Vercel serverless function
- Accessibility: keyboard-navigable nodes, focus-trapped dialogs, respects
  `prefers-reduced-motion` with an explanatory notice, lazy-loads the 3D canvas

## Getting started

```bash
npm install
npm run dev
```

## Adding your photos

Drop images in `public/photos/` matching the paths listed in `gallery` in
`src/data/profile.ts` (`01.jpg`, `02.jpg`, …). Squarish or portrait crops read
best.

Any missing file is skipped, so you can add them a few at a time. If `gallery`
is empty the loader falls back to `portrait`; if nothing loads, the core simply
renders as particles.

## Editing your content

All content lives in `src/data/` — edit these, not the components:

- `profile.ts` — name, headline, bio, email, education, photos, CV, socials
- `experience.ts` — work history
- `projects.ts` — projects (add repo/demo URLs and the links appear)
- `skills.ts` — skill groups

## Build

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build
```

## Deploy to Vercel

Import the repo at vercel.com — Vite is auto-detected and `api/contact.js` is
picked up as a serverless function. Pushes to `main` deploy automatically.

To enable real email delivery for the contact form:

1. `npm i resend`
2. Uncomment the Resend block in `api/contact.js`
3. Set `RESEND_API_KEY` and `TO_EMAIL` in the Vercel project environment

## Project structure

```
api/                     Vercel serverless functions (contact form)
public/
  photos/                Gallery images shown inside the core
src/
  components/
    layout/              BootLoader, Hud, NodeNav, Modal, CompileMarker,
                         ReducedMotionNotice
    sections/            About, Experience, Projects, Skills, Contact
                         (rendered as panel content)
  data/                  Typed content (edit these)
  hooks/                 useReducedMotion, useScrollStage
  three/                 SceneCore (shell + photos + core + glow),
                         SceneBackground, revealProgress
```
