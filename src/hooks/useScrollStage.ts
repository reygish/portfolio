import { useEffect, useState } from 'react';
import { revealProgress } from '@/three/revealProgress';

/** Progress at which the core has landed and the nodes may appear. */
const HUB_THRESHOLD = 0.9;

/**
 * Drives the scroll sequence. Writes document progress into the shared store
 * for the render loop, and reports whether the core has arrived at the hub so
 * the navigation nodes can mount.
 *
 * When `enabled` is false (reduced motion / low power) the sequence is skipped
 * entirely and the hub is presented immediately.
 */
export function useScrollStage(enabled: boolean): boolean {
  const [atHub, setAtHub] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      revealProgress.scroll = 1;
      setAtHub(true);
      return;
    }

    const read = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
      revealProgress.scroll = p;
      // React bails out when the boolean is unchanged, so this only re-renders
      // on the threshold crossing rather than on every scroll tick.
      setAtHub(p >= HUB_THRESHOLD);
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [enabled]);

  return atHub;
}
