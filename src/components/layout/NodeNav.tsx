import { useState } from 'react';
import { motion } from 'framer-motion';

export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'contact';

interface NodeDef {
  id: SectionId;
  label: string;
  index: string;
  x: number;
  y: number;
}

/** Arc of nodes fanning out above the core. Percentages of the viewport. */
const NODES: NodeDef[] = [
  { id: 'about', label: 'About', index: '01', x: 12, y: 60 },
  { id: 'experience', label: 'Experience', index: '02', x: 29, y: 48 },
  { id: 'projects', label: 'Projects', index: '03', x: 50, y: 42 },
  { id: 'skills', label: 'Skills', index: '04', x: 71, y: 48 },
  { id: 'contact', label: 'Contact', index: '05', x: 88, y: 60 },
];

/**
 * Where the connector lines converge: the core's screen position once it has
 * landed at the hub. Derived from the scene's HUB_Y and camera — keep the two
 * in step if you move the core.
 */
const HUB = { x: 50, y: 78 };

interface NodeNavProps {
  onSelect: (id: SectionId) => void;
}

export default function NodeNav({ onSelect }: NodeNavProps) {
  const [hovered, setHovered] = useState<SectionId | null>(null);

  return (
    <nav aria-label="Sections" className="absolute inset-0">
      {/* Connectors (decorative; the buttons carry the semantics) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {NODES.map((n, i) => {
          const active = hovered === n.id;
          return (
            <motion.line
              key={n.id}
              x1={HUB.x}
              y1={HUB.y}
              x2={n.x}
              y2={n.y}
              vectorEffect="non-scaling-stroke"
              stroke={active ? '#5b8bff' : '#2f6bff'}
              strokeOpacity={active ? 0.8 : 0.25}
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </svg>

      <ul className="hidden md:block">
        {NODES.map((n, i) => (
          <li
            key={n.id}
            className="absolute"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.button
              type="button"
              onClick={() => onSelect(n.id)}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(n.id)}
              onBlur={() => setHovered(null)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group pointer-events-auto flex flex-col items-center gap-2 p-2
                         focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span
                aria-hidden
                className="relative flex h-3 w-3 items-center justify-center"
              >
                <span
                  className="absolute h-3 w-3 rounded-full bg-accent/25 transition-transform
                             duration-500 group-hover:scale-[2.2] group-focus-visible:scale-[2.2]"
                />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent-soft transition-colors duration-300 group-hover:bg-ink" />
              </span>

              <span className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                  {n.index}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft transition-colors duration-300 group-hover:text-ink">
                  {n.label}
                </span>
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      <ul className="flex h-full flex-col items-center justify-center gap-5 md:hidden">
        {NODES.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => onSelect(n.id)}
              className="pointer-events-auto flex items-center gap-3 px-2 py-1"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-ink-faint">
                {n.index}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                {n.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
