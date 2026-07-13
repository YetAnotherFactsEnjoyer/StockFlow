import {
  Button as MaterialButton,
} from '@material-tailwind/react';
import { useNavigate } from '@tanstack/react-router';

import type {
  DashboardQuickAction,
  DashboardSummaryItem,
  DashboardViewModel,
} from '../types/dashboardViewModel';

interface DashboardPageProps {
  dashboard: DashboardViewModel;
}

const primaryButtonClasses = [
  'inline-flex min-h-11 items-center justify-center rounded-xl border',
  'border-brand-default bg-brand-default px-6 text-sm font-semibold text-white',
  'shadow-sm transition-all hover:border-brand-hover hover:bg-brand-hover hover:shadow',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

export function DashboardPage({
  dashboard,
}: DashboardPageProps) {
  const navigate = useNavigate();

  function handleAction(
    action: DashboardQuickAction,
  ) {
    if (action.id === 'add-product') {
      void navigate({
        to: '/products',
        search: {
          quickCreate: true,
        },
      });
      return;
    }

    void navigate({
      to: action.path,
      search: {},
    });
  }

  function handleAddProduct() {
    void navigate({
      to: '/products',
      search: {
        quickCreate: true,
      },
    });
  }

  function handleViewProducts() {
    void navigate({
      to: '/products',
      search: {},
    });
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-8">
      <DashboardHeader
        dashboard={dashboard}
        onAddProduct={handleAddProduct}
      />

      {dashboard.state === 'empty' ? (
        <DashboardEmptyState
          dashboard={dashboard}
          onAddProduct={handleAddProduct}
        />
      ) : (
        <DashboardContent
          dashboard={dashboard}
          onAction={handleAction}
          onViewProducts={handleViewProducts}
        />
      )}
    </main>
  );
}

function DashboardHeader({
  dashboard,
  onAddProduct,
}: {
  dashboard: DashboardViewModel;
  onAddProduct: () => void;
}) {
  return (
    <header className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-default">
          Workspace overview
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
          {dashboard.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">
          {dashboard.subtitle}
        </p>
        <p className="mt-2 text-xs font-medium text-text-secondary">
          {dashboard.updatedLabel}
        </p>
      </div>

      {dashboard.state === 'ready' && (
        <MaterialButton
          type="button"
          variant="solid"
          color="primary"
          ripple={false}
          onClick={onAddProduct}
          className={primaryButtonClasses}
        >
          Add product
        </MaterialButton>
      )}
    </header>
  );
}

function DashboardContent({
  dashboard,
  onAction,
  onViewProducts,
}: {
  dashboard: DashboardViewModel;
  onAction: (
    action: DashboardQuickAction,
  ) => void;
  onViewProducts: () => void;
}) {
  return (
    <div className="space-y-8">
      <SummaryStrip
        items={dashboard.summaryItems}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border-subtle">
          <div className="flex items-center justify-between gap-5 border-b border-border-subtle bg-surface-secondary p-6">
            <div>
              <h2 className="text-lg font-bold text-text-primary">
                Needs attention
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Products that may require action.
              </p>
            </div>

            {dashboard.attentionItems.length > 0 && (
              <MaterialButton
                type="button"
                variant="ghost"
                color="primary"
                ripple={false}
                onClick={onViewProducts}
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-transparent bg-transparent px-2 text-sm font-semibold text-brand-default shadow-none transition-colors hover:bg-brand-soft hover:text-brand-hover hover:shadow-none"
              >
                View all
              </MaterialButton>
            )}
          </div>

          {dashboard.attentionItems.length === 0 ? (
            <p className="p-8 text-center text-sm text-text-secondary">
              No products currently require attention.
            </p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {dashboard.attentionItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-4 p-6 transition-colors hover:bg-surface-secondary sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate text-sm font-bold text-text-primary">
                        {item.productName}
                      </h3>
                      <span
                        className={[
                          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                          item.severity === 'critical'
                            ? 'bg-danger/10 text-danger ring-danger/20'
                            : 'bg-warning/10 text-warning ring-warning/20',
                        ].join(' ')}
                      >
                        {item.statusLabel}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-text-secondary">
                      {item.sku}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {item.stockLabel}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {item.thresholdLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <QuickActions
          dashboard={dashboard}
          onAction={onAction}
        />
      </div>

      <RecentActivity dashboard={dashboard} />
    </div>
  );
}

function SummaryStrip({
  items,
}: {
  items: DashboardSummaryItem[];
}) {
  return (
    <section className="grid divide-y divide-border-subtle overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border-subtle sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-6 transition-colors hover:bg-surface-secondary"
        >
          <p className="text-sm font-medium text-text-secondary">
            {item.label}
          </p>
          <p
            className={[
              'mt-2 text-3xl font-extrabold tracking-tight',
              item.emphasis === 'warning'
                ? 'text-danger'
                : 'text-text-primary',
            ].join(' ')}
          >
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}

function QuickActions({
  dashboard,
  onAction,
}: {
  dashboard: DashboardViewModel;
  onAction: (
    action: DashboardQuickAction,
  ) => void;
}) {
  return (
    <aside className="self-start rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border-subtle">
      <h2 className="text-lg font-bold text-text-primary">
        Quick actions
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Common inventory operations.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {dashboard.quickActions.map((action) => (
          <MaterialButton
            key={action.id}
            type="button"
            variant="ghost"
            color="secondary"
            ripple={false}
            onClick={() =>
              onAction(action)
            }
            className="group flex min-h-11 w-full items-center justify-between rounded-xl border border-transparent bg-transparent p-3 text-left text-sm font-semibold text-text-primary shadow-none transition-all hover:bg-brand-soft hover:text-brand-default hover:shadow-none"
          >
            {action.label}
            <span
              aria-hidden="true"
              className="text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-brand-default"
            >
              →
            </span>
          </MaterialButton>
        ))}
      </div>
    </aside>
  );
}

function RecentActivity({
  dashboard,
}: {
  dashboard: DashboardViewModel;
}) {
  return (
    <section className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border-subtle">
      <div className="border-b border-border-subtle bg-surface-secondary p-6">
        <h2 className="text-lg font-bold text-text-primary">
          Recent stock activity
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          The latest changes made to inventory.
        </p>
      </div>

      {dashboard.recentActivity.length === 0 ? (
        <p className="p-8 text-center text-sm text-text-secondary">
          No stock activity has been recorded yet.
        </p>
      ) : (
        <div className="divide-y divide-border-subtle p-2 sm:p-0">
          {dashboard.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="grid gap-4 p-4 transition-colors hover:bg-surface-secondary sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:px-6 sm:py-5"
            >
              <p
                className={[
                  'inline-flex w-fit items-center justify-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset',
                  activity.direction === 'positive'
                    ? 'bg-success/10 text-success ring-success/20'
                    : activity.direction === 'negative'
                      ? 'bg-danger/10 text-danger ring-danger/20'
                      : 'bg-surface-secondary text-text-primary ring-border-subtle',
                ].join(' ')}
              >
                {activity.quantityLabel}
              </p>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text-primary">
                  {activity.productName}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  {activity.actionLabel}
                  {activity.performedByLabel && (
                    <span className="font-medium">
                      {' '}
                      by {activity.performedByLabel}
                    </span>
                  )}
                </p>
              </div>

              <p className="text-xs font-medium text-text-secondary sm:text-right">
                {activity.dateLabel}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function DashboardEmptyState({
  dashboard,
  onAddProduct,
}: {
  dashboard: DashboardViewModel;
  onAddProduct: () => void;
}) {
  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border-subtle bg-surface px-6 py-24 text-center sm:py-32">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-text-primary">
          Your inventory is empty
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          {dashboard.subtitle}
        </p>
        <MaterialButton
          type="button"
          variant="solid"
          color="primary"
          ripple={false}
          onClick={onAddProduct}
          className={`${primaryButtonClasses} mt-8`}
        >
          Add first product
        </MaterialButton>
      </div>
    </section>
  );
}
