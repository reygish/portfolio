import { lazy, Suspense, useEffect } from 'react';
import { revealProgress } from '@/three/revealProgress';

const SceneCore = lazy(() => import('@/three/SceneCore'));

/**
 * Fixed, full-viewport layer holding the glowing core. Sits beneath the HUD
 * and panels (z-0, pointer events off) so it is always present without ever
 * intercepting clicks.
 */
export default function SceneBackground() {
  // Track the cursor globally — the canvas can't receive pointer events
  // because the interface sits on top of it.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      revealProgress.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      revealProgress.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Suspense fallback={null}>
        <SceneCore />
      </Suspense>
    </div>
  );
}
