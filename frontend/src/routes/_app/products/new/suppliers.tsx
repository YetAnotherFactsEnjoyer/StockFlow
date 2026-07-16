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
  ProductSuppliersFields,
} from '../../../../features/products/components/creation/ProductSuppliersFields';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';
import {
  hasProductSuppliersErrors,
  type ProductSuppliersErrors,
  validateProductSuppliers,
} from '../../../../features/products/utils/validateProductSuppliers';
import {
  supplierRepository,
} from '../../../../features/suppliers/api';
import {
  Button,
} from '../../../../shared/components/Button';

export const Route = createFileRoute(
  '/_app/products/new/suppliers',
)({
  loader: () =>
    supplierRepository.listActive(),
  component: ProductSuppliersEntry,
});

function ProductSuppliersEntry() {
  const navigate = useNavigate();
  const suppliers =
    Route.useLoaderData();

  const {
    state,
    dispatch,
  } = useProductCreation();

  const [errors, setErrors] =
    useState<ProductSuppliersErrors>({});

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: 'suppliers',
    });
  }, [dispatch]);

  const linkedSuppliers =
    state.draft.suppliers;

  async function handleContinue(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors =
      validateProductSuppliers(
        linkedSuppliers,
      );

    setErrors(nextErrors);

    if (
      hasProductSuppliersErrors(
        nextErrors,
      )
    ) {
      return;
    }

    dispatch({
      type: 'MARK_STEP_COMPLETE',
      payload: 'suppliers',
    });

    await navigate({
      to: '/products/new/customers',
    });
  }

  async function handleSkip() {
    dispatch({
      type: 'SKIP_STEP',
      payload: 'suppliers',
    });

    await navigate({
      to: '/products/new/customers',
    });
  }

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface">
      <header className="border-b border-border-subtle px-6 py-5 sm:px-8">
        <p className="text-sm font-semibold text-brand-default">
          Step 3
        </p>

        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Suppliers
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Link one or more suppliers and
          configure their sourcing details.
        </p>
      </header>

      <form onSubmit={handleContinue}>
        <div className="px-6 py-8 sm:px-8">
          <ProductSuppliersFields
            suppliers={suppliers}
            value={linkedSuppliers}
            errors={errors}
            onChange={(nextSuppliers) => {
              dispatch({
                type: 'SET_SUPPLIERS',
                payload: nextSuppliers,
              });

              setErrors({});
            }}
          />
        </div>

        <footer className="flex flex-col gap-4 border-t border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            to="/products/new/inventory"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
          >
            Back
          </Link>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
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
