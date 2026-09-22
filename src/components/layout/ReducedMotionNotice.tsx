import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotionState } from '@/hooks/useReducedMotion';

const COPY: Record<string, { text: string }> = {
  preference: {
    text: 'Reduced-motion is on in your system settings, so the animated 3D scene is turned off. This static view is intentional — nothing is broken.',
  },
  'low-power': {
    text: "This device looks power-constrained, so the animated 3D scene is turned off to keep things smooth. This static view is intentional — nothing is broken.",
  },
};

/**
 * A small, dismissible notice shown when the reduced-motion fallback is
 * active, so the static hero doesn't read as a bug.
 */
export default function ReducedMotionNotice() {
  const { reduced, reason } = useReducedMotionState();
  const [dismissed, setDismissed] = useState(false);

  const copy = reason === 'none' ? null : COPY[reason];
  const show = reduced && !dismissed && copy;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-start gap-3
                     border border-ink/15 bg-base-soft/95 px-4 py-3 backdrop-blur-sm
                     md:inset-x-auto md:right-6 md:bottom-6"
        >
          <span aria-hidden className="mt-0.5 text-accent-soft">
            ◇
          </span>
          <p className="flex-1 text-xs leading-relaxed text-ink-soft">
            {copy.text}
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss notice"
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em]
                       text-ink-faint transition-colors duration-300 hover:text-ink"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
