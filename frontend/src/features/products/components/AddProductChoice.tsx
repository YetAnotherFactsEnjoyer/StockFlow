import { Link } from '@tanstack/react-router';
import {
  FiArrowRight,
  FiSettings,
  FiX,
  FiZap,
} from 'react-icons/fi';

interface AddProductChoiceProps {
  open: boolean;
  onClose: () => void;
  onQuickCreate: () => void;
}

export function AddProductChoice({
  open,
  onClose,
  onQuickCreate,
}: AddProductChoiceProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 py-8"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-product-choice-title"
        className="w-full max-w-xl rounded-2xl border border-border-subtle bg-surface shadow-2xl"
      >
        <header className="flex items-start justify-between gap-6 border-b border-border-subtle px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-brand-default">
              Product creation
            </p>

            <h2
              id="add-product-choice-title"
              className="mt-1 text-xl font-semibold text-text-primary"
            >
              How do you want to create it?
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Start quickly with essential details
              or configure the complete product.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close product creation choices"
            onClick={onClose}
            className="grid size-10 shrink-0 place-items-center rounded-xl text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            <FiX className="size-5" />
          </button>
        </header>

        <div className="grid gap-3 p-6">
          <button
            type="button"
            onClick={onQuickCreate}
            className="group flex w-full items-center gap-4 rounded-xl border border-border-subtle px-4 py-4 text-left transition hover:border-brand-default hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-default">
              <FiZap
                aria-hidden="true"
                className="size-5"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-text-primary">
                Quick creation
              </span>

              <span className="mt-1 block text-sm leading-5 text-text-secondary">
                Create a basic product using its
                essential details only.
              </span>
            </span>

            <FiArrowRight
              aria-hidden="true"
              className="size-5 shrink-0 text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-brand-default"
            />
          </button>

          <Link
            to="/products/new"
            onClick={onClose}
            className="group flex w-full items-center gap-4 rounded-xl border border-border-subtle px-4 py-4 text-left transition hover:border-brand-default hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-secondary text-text-primary">
              <FiSettings
                aria-hidden="true"
                className="size-5"
              />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-text-primary">
                Full creation
              </span>

              <span className="mt-1 block text-sm leading-5 text-text-secondary">
                Configure inventory, suppliers,
                customers, and pricing.
              </span>
            </span>

            <FiArrowRight
              aria-hidden="true"
              className="size-5 shrink-0 text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-brand-default"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
