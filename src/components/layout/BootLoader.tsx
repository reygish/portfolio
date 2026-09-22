import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { profile } from '@/data/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface BootLoaderProps {
  onDone: () => void;
}

const BOOT_LINES = [
  '> initializing portfolio.sys',
  '> loading modules … three.js, react, motion',
  '> building project …',
  '> mounting experience …',
  '> compiling identity …',
  '> ready.',
];

/**
 * Full-screen boot sequence shown on first load. Types out a fake terminal
 * boot log, slams the name in, then lifts away to reveal the hero.
 * Skippable via click/key, and skipped entirely for reduced-motion users.
 */
export default function BootLoader({ onDone }: BootLoaderProps) {
  const reduced = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [showName, setShowName] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    window.setTimeout(onDone, 700);
  };

  useEffect(() => {
    if (reduced) {
      onDone();
      return;
    }

    const timers: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines(BOOT_LINES.slice(0, i + 1));
        }, 350 + i * 420),
      );
    });

    const nameAt = 350 + BOOT_LINES.length * 420 + 200;
    timers.push(window.setTimeout(() => setShowName(true), nameAt));
    timers.push(window.setTimeout(finish, nameAt + 1100));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-full max-w-md px-6 font-mono text-sm text-ink-soft">
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={
                  line.includes('ready') ? 'text-accent-soft' : 'text-ink/60'
                }
              >
                {line}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showName && (
              <motion.h1
                initial={{ opacity: 0, scale: 1.3, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: '-0.02em' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 text-center text-4xl font-semibold uppercase tracking-tight text-ink md:text-6xl"
              >
                {profile.name}
              </motion.h1>
            )}
          </AnimatePresence>

          <p className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            click or press any key to skip
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
