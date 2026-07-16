import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  useEffect,
  useState,
} from 'react';

import {
  customerRepository,
} from '../../../../features/customers/api';
import {
  useOnboarding,
} from '../../../../features/onboarding/context/useOnboarding';
import {
  productRepository,
} from '../../../../features/products/api';
import {
  ProductCreatedSuccess,
} from '../../../../features/products/components/QuickCreateProduct';
import {
  ProductReviewSummary,
} from '../../../../features/products/components/creation/ProductReviewSummary';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';
import type {
  Product,
} from '../../../../features/products/types/product';
import {
  buildFullProductRequest,
} from '../../../../features/products/utils/buildFullProductRequest';
import {
  supplierRepository,
} from '../../../../features/suppliers/api';
import {
  Button,
} from '../../../../shared/components/Button';

export const Route = createFileRoute(
  '/_app/products/new/review',
)({
  loader: async () => {
    const [
      suppliers,
      customers,
    ] = await Promise.all([
      supplierRepository.listActive(),
      customerRepository.listActive(),
    ]);

    return {
      suppliers,
      customers,
    };
  },
  component: ProductReviewEntry,
});

function ProductReviewEntry() {
  const navigate = useNavigate();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    suppliers,
    customers,
  } = Route.useLoaderData();
  const {
    state,
    defaults,
    dispatch,
  } = useProductCreation();
  const { state: workspace } = useOnboarding();
  const [submitting, setSubmitting] =
    useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);
  const [createdProduct, setCreatedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: 'review',
    });
  }, [dispatch]);

  useEffect(() => {
    if (!createdProduct) {
      return;
    }

    const redirectTimer = window.setTimeout(
      () => {
        void (async () => {
          await navigate({
            to: '/products',
          });
          await router.invalidate();
        })();
      },
      shouldReduceMotion ? 900 : 1800,
    );

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [createdProduct, navigate, router, shouldReduceMotion]);

  async function handleCreateProduct() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const request =
        buildFullProductRequest(state);
      const product =
        await productRepository.create(request);

      dispatch({
        type: 'MARK_STEP_COMPLETE',
        payload: 'review',
      });
      dispatch({
        type: 'RESET',
        payload: defaults,
      });
      setCreatedProduct(product);
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

  return (
    <AnimatePresence initial={false} mode="wait">
      {createdProduct ? (
        <ProductCreatedSuccess
          key="success"
          product={createdProduct}
          reduceMotion={Boolean(shouldReduceMotion)}
        />
      ) : (
    <motion.section
      key="review"
      className="rounded-2xl border border-border-subtle bg-surface"
      exit={
        shouldReduceMotion
          ? undefined
          : { opacity: 0, y: -6 }
      }
      transition={{
        duration: 0.16,
        ease: 'easeOut',
      }}
    >
      <header className="border-b border-border-subtle px-6 py-5 sm:px-8">
        <p className="text-sm font-semibold text-brand-default">Step 5</p>
        <h2 className="mt-1 text-xl font-semibold text-text-primary">
          Review
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
          Review all product information before creating it.
        </p>
      </header>

      <div className="px-6 py-8 sm:px-8">
        {submitError && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {submitError}
          </p>
        )}

        <ProductReviewSummary
          state={state}
          suppliers={suppliers}
          customers={customers}
          currency={workspace.organization.currency}
        />
      </div>

      <footer className="flex flex-col gap-4 border-t border-border-subtle px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link
          to="/products/new/customers"
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
        >
          Back
        </Link>
        <Button
          type="button"
          loading={submitting}
          onClick={() => {
            void handleCreateProduct();
          }}
        >
          Create product
        </Button>
      </footer>
    </motion.section>
      )}
    </AnimatePresence>
  );
}
