import {
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  motion,
  useReducedMotion,
} from 'motion/react';

interface ProductDialogFrameProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  layout?: 'modal' | 'wide' | 'drawer';
}

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function ProductDialogFrame({
  titleId,
  onClose,
  children,
  layout = 'modal',
}: ProductDialogFrameProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => {
      const firstFocusable =
        panelRef.current?.querySelector<HTMLElement>(
          focusableSelector,
        );
      (firstFocusable ?? panelRef.current)?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          focusableSelector,
        ),
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, []);

  const isDrawer = layout === 'drawer';
  const widthClass =
    layout === 'wide'
      ? 'max-w-5xl'
      : layout === 'modal'
        ? 'max-w-xl'
        : 'h-full max-w-2xl rounded-none sm:rounded-l-2xl';

  return (
    <motion.div
      className={[
        'fixed inset-0 z-50 flex bg-black/45 p-0 backdrop-blur-[2px]',
        isDrawer
          ? 'justify-end'
          : 'items-center justify-center p-4',
      ].join(' ')}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.18 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-2xl outline-none ${widthClass}`}
        initial={
          reduceMotion
            ? false
            : isDrawer
              ? { x: 48, opacity: 0 }
              : { y: 16, scale: 0.98, opacity: 0 }
        }
        animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : isDrawer
              ? { x: 48, opacity: 0 }
              : { y: 12, scale: 0.98, opacity: 0 }
        }
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
