import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompileMarker from '@/components/layout/CompileMarker';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Short lowercase id used by the build-log marker, e.g. "projects". */
  marker: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Overlay panel used for every section. Keeps the 3D core visible behind it,
 * so navigating never leaves the scene.
 *
 * Accessibility: labelled dialog, Escape to dismiss, focus moved in on open
 * and restored on close, Tab cycles within the panel, background scroll locked.
 */
export default function Modal({
  open,
  onClose,
  marker,
  eyebrow,
  title,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = `modal-title-${marker}`;

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();

    return () => restoreRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:p-8">
          <motion.button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-default bg-base/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex max-h-full w-full max-w-4xl flex-col
                       border border-ink/15 bg-base-soft/95 outline-none
                       shadow-[0_0_80px_-20px_rgba(47,107,255,0.45)]"
          >
            <header className="flex items-start justify-between gap-6 border-b border-ink/10 px-6 py-6 md:px-10 md:py-8">
              <div>
                <CompileMarker label={marker} />
                <p className="eyebrow mb-2">{eyebrow}</p>
                <h2
                  id={titleId}
                  className="display-sm-heading text-ink"
                >
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 border border-ink/20 px-3 py-2 font-mono text-[11px]
                           uppercase tracking-[0.2em] text-ink-soft transition-colors
                           duration-300 hover:border-accent hover:text-accent-soft"
              >
                Close
              </button>
            </header>

            <div className="overflow-y-auto px-6 py-8 md:px-10 md:py-10">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
