import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CompileMarkerProps {
  label: string;
}

/**
 * A small build-log style marker: `> compiling about… done`.
 * It types the "compiling" line, then flips to "done" once fully in view.
 * Purely decorative; respects reduced motion by rendering the final state.
 */
export default function CompileMarker({ label }: CompileMarkerProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'idle' | 'compiling' | 'done'>(
    reduced ? 'done' : 'idle',
  );

  useEffect(() => {
    if (reduced || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase('compiling');
            const timer = window.setTimeout(() => setPhase('done'), 900);
            observer.disconnect();
            return () => window.clearTimeout(timer);
          }
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="mb-3 font-mono text-xs tracking-tight text-ink/40"
    >
      {phase === 'idle' && <span>&nbsp;</span>}
      {phase === 'compiling' && (
        <span className="text-accent">
          &gt; compiling {label}
          <span className="animate-pulse">…</span>
        </span>
      )}
      {phase === 'done' && (
        <span>
          &gt; compiled {label}{' '}
          <span className="text-green-600">✓</span>
        </span>
      )}
    </div>
  );
}
