import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NodeNav, { type SectionId } from '@/components/layout/NodeNav';
import { revealProgress } from '@/three/revealProgress';
import { profile } from '@/data/profile';

interface HudProps {
  /** True once the core has landed and the nodes should appear. */
  atHub: boolean;
  /** True when the scroll sequence is active (false for reduced motion). */
  animated: boolean;
  /** Fades the whole layer in once the boot sequence has lifted. */
  visible: boolean;
  onSelect: (id: SectionId) => void;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Fixed interface layer above the scene. The identity clears as the core
 * descends, a flash marks the landing, and the navigation nodes fan out of
 * the core once it arrives.
 *
 * Scroll-driven values are written straight to style in a rAF loop rather than
 * through React state, so scrolling never triggers a re-render.
 */
export default function Hud({ atHub, animated, visible, onSelect }: HudProps) {
  const identityRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) return;

    let raf = 0;
    const tick = () => {
      const s = revealProgress.scroll;

      const out = clamp01(s / 0.5);
      if (identityRef.current) {
        identityRef.current.style.opacity = String(1 - out);
        identityRef.current.style.transform = `translateY(${-out * 32}px)`;
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - clamp01(s / 0.18));
      }

      const up = clamp01((s - 0.78) / 0.13);
      const down = clamp01((s - 0.93) / 0.07);
      if (flashRef.current) {
        flashRef.current.style.opacity = String(up * (1 - down) * 0.85);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [animated]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-10 transition-opacity duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={identityRef}
        className="absolute inset-x-0 top-0 px-6 pt-10 will-change-transform md:px-10 md:pt-12"
        style={animated ? undefined : { opacity: 0 }}
      >
        <p className="eyebrow mb-3">{profile.headline}</p>
        <h1 className="display-heading text-ink">
          {profile.name.split(' ')[0]}
          <span className="block text-accent">builds systems.</span>
        </h1>
      </div>

      <AnimatePresence>
        {atHub && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <NodeNav onSelect={onSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {atHub && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inset-x-0 top-0 px-6 pt-10 font-mono text-[11px]
                       uppercase tracking-[0.25em] text-ink-soft md:px-10 md:pt-12"
          >
            {profile.name}
            <span className="text-accent"> · </span>
            {profile.headline}
          </motion.p>
        )}
      </AnimatePresence>

      {animated && (
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-2"
        >
          <span className="meta-line">scroll</span>
          <span
            aria-hidden
            className="h-8 w-px bg-gradient-to-b from-ink/40 to-transparent"
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-4 px-6 pb-6 md:px-10 md:pb-8">
        <p className="meta-line">{profile.location}</p>
        <div className="flex gap-6">
          {profile.cv && (
            <a
              href={profile.cv}
              target="_blank"
              rel="noreferrer"
              className="link-action group/link pointer-events-auto text-accent-soft"
            >
              CV
              <span className="link-action-arrow" aria-hidden>
                ↗
              </span>
            </a>
          )}
          {profile.socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="link-action group/link pointer-events-auto"
            >
              {s.label}
              <span className="link-action-arrow" aria-hidden>
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            'radial-gradient(circle at 50% 78%, rgba(215,230,255,0.95) 0%, rgba(90,140,255,0.5) 30%, rgba(5,5,7,0) 65%)',
        }}
      />
    </div>
  );
}
