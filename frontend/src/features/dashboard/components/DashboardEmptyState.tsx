import {
  FiPackage,
  FiPlus,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';

interface DashboardEmptyStateProps {
  onAddProduct: () => void;
}

export function DashboardEmptyState({
  onAddProduct,
}: DashboardEmptyStateProps) {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center justify-center py-12 text-center sm:py-20">
      <div className="w-full rounded-2xl border border-border-subtle bg-surface px-6 py-12 shadow-sm sm:px-10 sm:py-14">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-soft text-brand-default">
          <FiPackage aria-hidden="true" className="size-10" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary">
          Welcome to your Inventory Control Center
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
          You do not have any products yet. Add your first product to activate operational insights, track stock flow, and monitor risk.
        </p>
        <Button
          size="large"
          className="mt-8"
          leftIcon={<FiPlus className="size-4" />}
          onClick={onAddProduct}
        >
          Add your first product
        </Button>
      </div>
    </section>
  );
}
