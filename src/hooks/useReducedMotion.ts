import { useEffect, useState } from 'react';

/**
 * Returns true when the user has requested reduced motion, or when the
 * device appears to be low-powered (few CPU cores / small screen).
 * Components use this to fall back to lighter visuals.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => getInitial());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(getInitial());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function getInitial(): boolean {
  if (typeof window === 'undefined') return false;

  const prefersReduced =
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  // Heuristic for low-power devices: very few logical cores.
  const cores = navigator.hardwareConcurrency ?? 8;
  const lowPower = cores > 0 && cores <= 4;

  return prefersReduced || lowPower;
}
