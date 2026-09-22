/**
 * Shared, mutable bridge between the DOM layer and the react-three-fiber
 * render loop. Written by DOM listeners, read inside `useFrame`. A plain
 * object is used to avoid re-rendering React on every scroll or pointer tick.
 */
export const revealProgress = {
  /** 0 → 1 through the scroll sequence (core descends to the hub). */
  scroll: 0,
  /**
   * Pointer position in clip space (-1 → 1). Tracked on `window` because the
   * canvas sits behind the interface with pointer events disabled.
   */
  pointerX: 0,
  pointerY: 0,
  /** 0 → 1. Rises while a panel is open so the core recedes behind it. */
  dim: 0,
};
