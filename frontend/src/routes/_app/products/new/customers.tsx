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
  customerRepository,
} from '../../../../features/customers/api';
import {
  ProductCustomersFields,
} from '../../../../features/products/components/creation/ProductCustomersFields';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';
import {
  hasProductCustomersErrors,
  type ProductCustomersErrors,
  validateProductCustomers,
} from '../../../../features/products/utils/validateProductCustomers';
import {
  Button,
} from '../../../../shared/components/Button';

export const Route = createFileRoute(
  '/_app/products/new/customers',
)({
  loader: () =>
    customerRepository.listActive(),
  component: ProductCustomersEntry,
});

function ProductCustomersEntry() {
  const navigate = useNavigate();
  const customers = Route.useLoaderData();
  const {
    state,
    dispatch,
  } = useProductCreation();
  const [errors, setErrors] =
    useState<ProductCustomersErrors>({});

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: 'customers',
    });
  }, [dispatch]);

  const commercial = state.draft.commercial;

  async function handleContinue(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const nextErrors =
      validateProductCustomers(commercial);
    setErrors(nextErrors);

    if (hasProductCustomersErrors(nextErrors)) {
      return;
    }

    dispatch({
      type: 'MARK_STEP_COMPLETE',
      payload: 'customers',
    });
    await navigate({
      to: '/products/new/review',
    });
  }

  async function handleSkip() {
    dispatch({
      type: 'SKIP_STEP',
      payload: 'customers',
    });
    await navigate({
      to: '/products/new/review',
    });
  }

  return (
    <section className="rounded-2xl border border-border-subtle bg-surface">
      <header className="border-b border-border-subtle px-6 py-5 sm:px-8">
        <p className="text-sm font-semibold text-brand-default">Step 4</p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Customers
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Decide whether this product is internal, available to everyone, or
          restricted to selected customers.
        </p>
      </header>

      <form onSubmit={handleContinue}>
        <div className="px-6 py-8 sm:px-8">
          <ProductCustomersFields
            customers={customers}
            value={commercial}
            errors={errors}
            onCommercialChange={(patch) => {
              dispatch({
                type: 'UPDATE_COMMERCIAL',
                payload: patch,
              });
              setErrors({});
            }}
            onCustomersChange={(nextCustomers) => {
              dispatch({
                type: 'SET_CUSTOMERS',
                payload: nextCustomers,
              });
              setErrors({});
            }}
          />
        </div>

        <footer className="flex flex-col gap-4 border-t border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link
            to="/products/new/suppliers"
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
            <Button type="submit">Continue</Button>
          </div>
        </footer>
      </form>
    </section>
  );
}
