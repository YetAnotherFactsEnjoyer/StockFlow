import {
  Button as MaterialButton,
  IconButton as MaterialIconButton,
} from '@material-tailwind/react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  FiCheck,
  FiPlus,
  FiX,
} from 'react-icons/fi';

import {
  productRepository,
} from '../api';
import {
  useProductCreation,
} from '../context/useProductCreation';
import type {
  Product,
} from '../types/product';
import {
  buildQuickProductRequest,
} from '../utils/buildQuickProductInput';
import {
  hasProductDetailsErrors,
  type ProductDetailsErrors,
  validateProductDetails,
} from '../utils/validateProductDetails';
import {
  ProductDetailsFields,
} from './creation/ProductDetailsFields';

interface QuickCreateProductProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (
    product: Product,
  ) => void;
}

export function QuickCreateProduct({
  open,
  onClose,
  onCreated,
}: QuickCreateProductProps) {
  const shouldReduceMotion =
    useReducedMotion();

  const dialogRef =
    useRef<HTMLElement>(null);

  const {
    state,
    defaults,
    dispatch,
  } = useProductCreation();

  const [errors, setErrors] =
    useState<ProductDetailsErrors>({});

  const [
    submitError,
    setSubmitError,
  ] = useState<string | null>(null);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    createdProduct,
    setCreatedProduct,
  ] = useState<Product | null>(null);

  const handleClose = useCallback(() => {
    if (submitting) {
      return;
    }

    setErrors({});
    setSubmitError(null);
    setCreatedProduct(null);
    onClose();
  }, [onClose, submitting]);

  useEffect(() => {
    if (!createdProduct) {
      return;
    }

    const closeTimer = window.setTimeout(
      () => {
        setCreatedProduct(null);
        onClose();
      },
      shouldReduceMotion ? 900 : 1800,
    );

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [
    createdProduct,
    onClose,
    shouldReduceMotion,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(
      () => {
        dialogRef.current
          ?.querySelector<HTMLElement>(
            '[data-initial-focus="true"]',
          )
          ?.focus();
      },
    );

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow =
        previousBodyOverflow;
      previouslyFocusedElement?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === 'Escape' &&
        !submitting
      ) {
        handleClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)',
        );

      if (!focusableElements?.length) {
        return;
      }

      const firstElement =
        focusableElements[0];
      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement ===
          firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement ===
          lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    open,
    handleClose,
    submitting,
  ]);

  if (!open) {
    return null;
  }

  const details =
    state.draft.details;

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors =
      validateProductDetails(
        details,
        {
          skuRequired:
            defaults.skuRequired,
        },
      );

    setErrors(nextErrors);
    setSubmitError(null);

    if (
      hasProductDetailsErrors(
        nextErrors,
      )
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const request =
        buildQuickProductRequest(
          details,
          defaults,
        );

      const product =
        await productRepository.create(
          request,
        );

      dispatch({
        type: 'RESET',
        payload: defaults,
      });

      setCreatedProduct(product);
      onCreated?.(product);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'The product could not be created.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:px-6"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget &&
          !submitting
        ) {
          handleClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          createdProduct
            ? 'quick-create-product-success-title'
            : 'quick-create-product-title'
        }
        aria-describedby={
          createdProduct
            ? 'quick-create-product-success-description'
            : 'quick-create-product-description'
        }
        className="flex max-h-[calc(100vh-3rem)] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-xl"
      >
        <AnimatePresence
          initial={false}
          mode="wait"
        >
          {createdProduct ? (
            <ProductCreatedSuccess
              key="success"
              product={createdProduct}
              reduceMotion={
                Boolean(shouldReduceMotion)
              }
            />
          ) : (
            <motion.div
              key="form"
              className="flex min-h-0 flex-1 flex-col"
              exit={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: 0,
                      y: -6,
                    }
              }
              transition={{
                duration: 0.16,
                ease: 'easeOut',
              }}
            >
        <header className="flex shrink-0 items-start justify-between gap-8 border-b border-border-subtle px-6 py-5 sm:px-8 sm:py-6">
          <div className="max-w-xl">
            <h2
              id="quick-create-product-title"
              className="text-xl font-semibold text-text-primary"
            >
              Add new product
            </h2>

            <p
              id="quick-create-product-description"
              className="mt-1 text-sm leading-6 text-text-secondary"
            >
              Enter the basic product information below.
            </p>
          </div>

          <MaterialIconButton
            type="button"
            variant="ghost"
            color="secondary"
            ripple={false}
            aria-label="Close quick product creation"
            disabled={submitting}
            onClick={handleClose}
            className="grid size-8 min-h-0 shrink-0 place-items-center rounded-md border border-transparent bg-transparent p-0 text-text-secondary shadow-none transition hover:bg-surface-secondary hover:text-text-primary hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiX className="size-[18px]" />
          </MaterialIconButton>
        </header>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
            {submitError && (
              <p
                role="alert"
                className="mb-6 rounded-lg border border-danger/30 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700"
              >
                {submitError}
              </p>
            )}

            <ProductDetailsFields
              value={details}
              errors={errors}
              skuRequired={
                defaults.skuRequired
              }
              disabled={submitting}
              autoFocusName
              onChange={(patch) => {
                dispatch({
                  type:
                    'UPDATE_DETAILS',

                  payload: patch,
                });

                setErrors((currentErrors) => {
                  const nextErrors = {
                    ...currentErrors,
                  };

                  for (const field of Object.keys(
                    patch,
                  ) as Array<keyof typeof patch>) {
                    delete nextErrors[field];
                  }

                  return nextErrors;
                });
                setSubmitError(null);
              }}
            />
          </div>

          <footer className="flex shrink-0 items-center justify-end border-t border-border-subtle bg-surface px-6 py-4 sm:px-8">
            <div className="ml-auto flex items-center gap-3">
              <MaterialButton
                type="button"
                variant="ghost"
                color="secondary"
                ripple={false}
                disabled={submitting}
                onClick={handleClose}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-transparent bg-transparent px-4 text-center text-sm font-medium text-text-secondary shadow-none transition hover:bg-surface-secondary hover:text-text-primary hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </MaterialButton>

              <MaterialButton
                type="submit"
                color="primary"
                variant="solid"
                ripple={false}
                disabled={submitting}
                aria-busy={submitting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-brand-default bg-brand-default px-4 text-center text-sm font-medium text-white shadow-sm transition hover:border-brand-hover hover:bg-brand-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                  />
                ) : (
                  <FiPlus className="size-4" />
                )}

                {submitting
                  ? 'Creating product…'
                  : 'Create product'}
              </MaterialButton>
            </div>
          </footer>
        </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>,
    document.body,
  );
}

interface ProductCreatedSuccessProps {
  product: Product;
  reduceMotion: boolean;
}

export function ProductCreatedSuccess({
  product,
  reduceMotion,
}: ProductCreatedSuccessProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="grid min-h-[440px] flex-1 place-items-center px-8 py-12 text-center"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 10,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.24,
        ease: 'easeOut',
      }}
    >
      <div className="max-w-sm">
        <motion.div
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-full bg-success-50 text-success-700 ring-1 ring-success-500/20"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.72,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 360,
            damping: 22,
            delay: 0.08,
          }}
        >
          <FiCheck className="size-7 stroke-[2.5]" />
        </motion.div>

        <motion.h2
          id="quick-create-product-success-title"
          className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-text-primary"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 6,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.22,
            delay: 0.18,
          }}
        >
          Product created
        </motion.h2>

        <motion.p
          id="quick-create-product-success-description"
          className="mt-2 text-sm leading-6 text-text-secondary"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 6,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.22,
            delay: 0.24,
          }}
        >
          <span className="font-semibold text-text-primary">
            {product.name}
          </span>{' '}
          is now in your product catalog.
        </motion.p>

        <motion.p
          className="mt-5 text-xs font-medium text-text-secondary"
          initial={
            reduceMotion
              ? false
              : { opacity: 0 }
          }
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.2,
            delay: 0.34,
          }}
        >
          Returning to products…
        </motion.p>
      </div>
    </motion.div>
  );
}
