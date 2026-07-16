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
  QuickCreateProduct,
} from '../../../../features/products/components/QuickCreateProduct';
import {
  ProductDetailsFields,
} from '../../../../features/products/components/creation/ProductDetailsFields';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';
import {
  hasProductDetailsErrors,
  type ProductDetailsErrors,
  validateProductDetails,
} from '../../../../features/products/utils/validateProductDetails';
import {
  Button,
} from '../../../../shared/components/Button';

export const Route = createFileRoute(
  '/_app/products/new/',
)({
  component: ProductDetailsEntry,
});

function ProductDetailsEntry() {
  const navigate = useNavigate();

  const {
    state,
    defaults,
    dispatch,
  } = useProductCreation();

  const [errors, setErrors] =
    useState<ProductDetailsErrors>({});

  const [
    quickCreateOpen,
    setQuickCreateOpen,
  ] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: 'details',
    });
  }, [dispatch]);

  const details =
    state.draft.details;

  async function handleContinue(
    event: FormEvent<HTMLFormElement>,
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

    if (
      hasProductDetailsErrors(
        nextErrors,
      )
    ) {
      return;
    }

    dispatch({
      type: 'MARK_STEP_COMPLETE',
      payload: 'details',
    });

    await navigate({
      to: '/products/new/inventory',
    });
  }

  function handleUseQuickCreation() {
    dispatch({
      type: 'SET_MODE',
      payload: 'quick',
    });

    setQuickCreateOpen(true);
  }

  function handleCloseQuickCreation() {
    setQuickCreateOpen(false);

    dispatch({
      type: 'SET_MODE',
      payload: 'full',
    });
  }

  function handleQuickProductCreated() {
    setQuickCreateOpen(false);

    void navigate({
      to: '/products',
    });
  }

  return (
    <>
      <section className="rounded-2xl border border-border-subtle bg-surface">
        <header className="border-b border-border-subtle px-6 py-5 sm:px-8">
          <p className="text-sm font-semibold text-brand-default">
            Step 1
          </p>

          <h2 className="mt-1 text-xl font-semibold text-text-primary">
            Product details
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Define what the item is and how it
            should be identified in StockFlow.
          </p>
        </header>

        <form onSubmit={handleContinue}>
          <div className="px-6 py-8 sm:px-8">
            <ProductDetailsFields
              value={details}
              errors={errors}
              skuRequired={
                defaults.skuRequired
              }
              onChange={(patch) => {
                dispatch({
                  type:
                    'UPDATE_DETAILS',

                  payload: patch,
                });

                setErrors({});
              }}
            />
          </div>

          <footer className="flex flex-col gap-4 border-t border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Button
              type="button"
              variant="ghost"
              onClick={
                handleUseQuickCreation
              }
            >
              Use quick creation instead
            </Button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Link
                to="/products"
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
              >
                Cancel
              </Link>

              <Button type="submit">
                Continue
              </Button>
            </div>
          </footer>
        </form>
      </section>

      <QuickCreateProduct
        open={quickCreateOpen}
        onClose={
          handleCloseQuickCreation
        }
        onCreated={
          handleQuickProductCreated
        }
      />
    </>
  );
}
