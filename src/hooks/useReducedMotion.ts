import { useEffect, useState } from 'react';

export type ReducedMotionReason = 'none' | 'preference' | 'low-power';

interface ReducedMotionState {
  reduced: boolean;
  reason: ReducedMotionReason;
}

function getState(): ReducedMotionState {
  if (typeof window === 'undefined') return { reduced: false, reason: 'none' };

  const prefersReduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (prefersReduced) return { reduced: true, reason: 'preference' };

  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores > 0 && cores <= 4) return { reduced: true, reason: 'low-power' };

  return { reduced: false, reason: 'none' };
}

/**
 * Reports whether animation should be reduced, and why: the user's OS
 * `prefers-reduced-motion` setting, or a low-power device heuristic.
 * Components use this to fall back to lighter visuals.
 */
export function useReducedMotionState(): ReducedMotionState {
  const [state, setState] = useState<ReducedMotionState>(() => getState());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setState(getState());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return state;
}

export function useReducedMotion(): boolean {
  return useReducedMotionState().reduced;
}
