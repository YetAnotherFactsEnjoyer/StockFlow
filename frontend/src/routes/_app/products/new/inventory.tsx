import {
  createFileRoute,
  Link,
  useNavigate,
} from '@tanstack/react-router';
import {
  useEffect,
  useState,
  type FormEvent,
} from 'react';

import {
  ProductInventoryFields,
} from '../../../../features/products/components/creation/ProductInventoryFields';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';
import {
  hasProductInventoryErrors,
  type ProductInventoryErrors,
  validateProductInventory,
} from '../../../../features/products/utils/validateProductInventory';
import {
  Button,
} from '../../../../shared/components/Button';

export const Route = createFileRoute(
  '/_app/products/new/inventory',
)({
  component: ProductInventoryEntry,
});

function ProductInventoryEntry() {
  const navigate = useNavigate();

  const {
    state,
    defaults,
    dispatch,
  } = useProductCreation();

  const [errors, setErrors] =
    useState<ProductInventoryErrors>({});

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: 'inventory',
    });
  }, [dispatch]);

  const inventory =
    state.draft.inventory;

  async function handleContinue(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors =
      validateProductInventory(
        inventory,
        {
          lowStockEnabled:
            defaults.lowStockEnabled,

          barcodeScanEnabled:
            defaults.barcodeScanEnabled,
        },
      );

    setErrors(nextErrors);

    if (
      hasProductInventoryErrors(
        nextErrors,
      )
    ) {
      return;
    }

    dispatch({
      type: 'MARK_STEP_COMPLETE',
      payload: 'inventory',
    });

    await navigate({
      to: '/products/new/suppliers',
    });
  }

  async function handleSkip() {
    dispatch({
      type: 'SKIP_STEP',
      payload: 'inventory',
    });

    await navigate({
      to: '/products/new/suppliers',
    });
  }

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface">
      <header className="border-b border-border-subtle px-6 py-5 sm:px-8">
        <p className="text-sm font-semibold text-brand-default">
          Step 2
        </p>

        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Inventory
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Configure the starting quantity,
          reorder threshold, and product
          tracking information.
        </p>
      </header>

      <form onSubmit={handleContinue}>
        <div className="px-6 py-8 sm:px-8">
          <ProductInventoryFields
            value={inventory}
            errors={errors}
            lowStockEnabled={
              defaults.lowStockEnabled
            }
            barcodeScanEnabled={
              defaults.barcodeScanEnabled
            }
            onChange={(patch) => {
              dispatch({
                type:
                  'UPDATE_INVENTORY',

                payload: patch,
              });

              setErrors({});
            }}
          />
        </div>

        <footer className="flex flex-col gap-4 border-t border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            to="/products/new"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            Back
          </Link>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                void handleSkip();
              }}
            >
              Skip for now
            </Button>

            <Button type="submit">
              Continue
            </Button>
          </div>
        </footer>
      </form>
    </section>
  );
}
