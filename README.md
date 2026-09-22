# Portfolio

An interactive, editorial portfolio for a Computer Science / ML student.
Built with Vite + React + TypeScript, react-three-fiber (Three.js), Framer Motion,
GSAP ScrollTrigger, and Tailwind CSS.

## Features

- **Boot sequence intro** — a terminal-style boot log, then the name lands
- **Holographic reveal centrepiece** — a faceted shell dissolves as the cursor
  approaches, revealing your portrait projected inside a particle core
- **Scroll-pinned handoff** — the assembly shrinks toward the centre of the
  screen, then blooms into a shine that hands off to the rest of the page
- Editorial design system: hairline rules, numbered rows, monospace metadata
  (no card grids, pill badges, or hover lifts)
- Working contact form with validation + a Vercel serverless function
- Accessibility & performance built in: respects `prefers-reduced-motion`,
  detects low-power devices and falls back to a static hero, lazy-loads the 3D canvas
- Content lives in typed data files — no component edits needed

## Project structure

```
api/                     Vercel serverless functions (contact form)
public/                  Static assets (drop portrait.jpg here)
src/
  components/
    layout/              BootLoader, Navbar, Footer, Section, CompileMarker
    sections/            Hero, About, Experience, Projects, Skills, Contact
  data/                  Typed content (edit these)
  hooks/                 useReducedMotion, useCompileReveal
  three/                 RevealScene (shell + portrait + core), revealProgress
```
