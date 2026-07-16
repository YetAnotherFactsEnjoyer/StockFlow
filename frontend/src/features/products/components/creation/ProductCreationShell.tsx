import {
  Link,
  useNavigate,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  FiCheck,
  FiX,
} from 'react-icons/fi';

import {
  useProductCreation,
} from '../../context/useProductCreation';
import {
  PRODUCT_CREATION_STEPS,
  type ProductCreationStep,
} from '../../types/productCreation';

interface ProductCreationShellProps {
  children: ReactNode;
}

type ProductCreationStepStatus =
  | 'current'
  | 'completed'
  | 'skipped'
  | 'upcoming';

const stepLabels: Record<
  ProductCreationStep,
  string
> = {
  details: 'Details',
  inventory: 'Inventory',
  suppliers: 'Suppliers',
  customers: 'Customers',
  review: 'Review',
};

export function ProductCreationShell({
  children,
}: ProductCreationShellProps) {
  const navigate = useNavigate();

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          void navigate({ to: '/products' });
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-product-creation-title"
        aria-describedby="full-product-creation-description"
        className="flex max-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface shadow-xl"
      >
        <header className="shrink-0 border-b border-border-subtle bg-surface">
          <div className="flex items-start justify-between gap-6 px-5 py-6 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-brand-default">
              Product creation
            </p>

            <h1
              id="full-product-creation-title"
              className="mt-1 text-2xl font-semibold text-text-primary sm:text-3xl"
            >
              Create a product
            </h1>

            <p
              id="full-product-creation-description"
              className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary"
            >
              Configure the product details,
              inventory, sourcing, and customer
              availability.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            <FiX
              aria-hidden="true"
              className="size-4"
            />

            <span className="hidden sm:inline">
              Cancel
            </span>
          </Link>
          </div>
        </header>

        <div className="shrink-0 border-b border-border-subtle bg-surface">
          <ProductCreationProgress />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto bg-app-bg px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </section>
    </div>
  );
}

function ProductCreationProgress() {
  const { state } = useProductCreation();

  return (
    <nav
      aria-label="Product creation progress"
      className="w-full px-5 py-5 sm:px-8"
    >
      <ol className="grid gap-3 sm:grid-cols-5">
        {PRODUCT_CREATION_STEPS.map(
          (step, index) => {
            const status = getStepStatus(
              step,
              state.currentStep,
              state.completedSteps,
              state.skippedSteps,
            );

            return (
              <li
                key={step}
                aria-current={
                  status === 'current'
                    ? 'step'
                    : undefined
                }
                className={[
                  'flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3',
                  getStepContainerClasses(
                    status,
                  ),
                ].join(' ')}
              >
                <StepIndicator
                  position={index + 1}
                  status={status}
                />

                <div className="min-w-0">
                  <p
                    className={[
                      'truncate text-xs font-medium',
                      status === 'current'
                        ? 'text-brand-default'
                        : 'text-text-secondary',
                    ].join(' ')}
                  >
                    Step {index + 1}
                  </p>

                  <p className="truncate text-sm font-semibold text-text-primary">
                    {stepLabels[step]}
                  </p>

                  {status === 'skipped' && (
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Skipped
                    </p>
                  )}
                </div>
              </li>
            );
          },
        )}
      </ol>
    </nav>
  );
}

interface StepIndicatorProps {
  position: number;
  status: ProductCreationStepStatus;
}

function StepIndicator({
  position,
  status,
}: StepIndicatorProps) {
  if (status === 'completed') {
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success text-white">
        <FiCheck
          aria-hidden="true"
          className="size-4"
        />
      </span>
    );
  }

  return (
    <span
      className={[
        'grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold',
        status === 'current'
          ? 'bg-brand-default text-white'
          : 'bg-surface-secondary text-text-secondary',
      ].join(' ')}
    >
      {position}
    </span>
  );
}

function getStepStatus(
  step: ProductCreationStep,
  currentStep: ProductCreationStep,
  completedSteps: ProductCreationStep[],
  skippedSteps: ProductCreationStep[],
): ProductCreationStepStatus {
  if (step === currentStep) {
    return 'current';
  }

  if (completedSteps.includes(step)) {
    return 'completed';
  }

  if (skippedSteps.includes(step)) {
    return 'skipped';
  }

  return 'upcoming';
}

function getStepContainerClasses(
  status: ProductCreationStepStatus,
) {
  switch (status) {
    case 'current':
      return 'border-brand-default bg-brand-soft';

    case 'completed':
      return 'border-success/30 bg-success/5';

    case 'skipped':
      return 'border-border-subtle bg-surface-secondary';

    case 'upcoming':
      return 'border-border-subtle bg-surface';
  }
}
