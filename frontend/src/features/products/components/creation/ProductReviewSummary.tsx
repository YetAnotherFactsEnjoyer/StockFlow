import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import type {
  Customer,
} from '../../../customers/types/customer';
import type {
  Supplier,
} from '../../../suppliers/types/supplier';
import type {
  ProductCreationState,
} from '../../types/productCreation';

interface ProductReviewSummaryProps {
  state: ProductCreationState;
  suppliers: Supplier[];
  customers: Customer[];
  currency: string;
}

const productTypeLabels = {
  finished_good: 'Finished good',
  raw_material: 'Raw material',
  component: 'Component',
  consumable: 'Consumable',
  packaging: 'Packaging',
  other: 'Other',
} as const;

const stockUnitLabels = {
  unit: 'Unit',
  kilogram: 'Kilogram',
  gram: 'Gram',
  liter: 'Liter',
  meter: 'Meter',
  box: 'Box',
  pallet: 'Pallet',
  custom: 'Custom',
} as const;

function formatMoney(
  value: string,
  currency: string,
) {
  const parsedValue = Number(value);

  if (!value.trim() || !Number.isFinite(parsedValue)) {
    return 'Not set';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(parsedValue);
}

export function ProductReviewSummary({
  state,
  suppliers,
  customers,
  currency,
}: ProductReviewSummaryProps) {
  const {
    details,
    inventory,
    commercial,
  } = state.draft;

  return (
    <div className="grid gap-5">
      <ReviewSection title="Product details" editTo="/products/new">
        <ReviewRow label="Name" value={details.name || 'Not set'} />
        <ReviewRow label="SKU" value={details.sku || 'Not set'} />
        <ReviewRow
          label="Type"
          value={
            details.type
              ? productTypeLabels[details.type]
              : 'Not set'
          }
        />
        <ReviewRow
          label="Stock unit"
          value={
            details.stockUnit === 'custom'
              ? details.customStockUnit
              : details.stockUnit
                ? stockUnitLabels[details.stockUnit]
                : 'Not set'
          }
        />
        <ReviewRow
          label="Description"
          value={details.description || 'Not set'}
        />
      </ReviewSection>

      <ReviewSection
        title="Inventory"
        editTo="/products/new/inventory"
        status={
          state.skippedSteps.includes('inventory')
            ? 'Skipped'
            : undefined
        }
      >
        {state.skippedSteps.includes('inventory') ? (
          <p className="text-sm text-text-secondary">
            Inventory configuration will use default values.
          </p>
        ) : (
          <>
            <ReviewRow
              label="Initial quantity"
              value={inventory.initialQuantity}
            />
            <ReviewRow
              label="Reorder threshold"
              value={inventory.reorderLevel || 'Not set'}
            />
            <ReviewRow
              label="Barcode"
              value={inventory.barcode || 'Not set'}
            />
          </>
        )}
      </ReviewSection>

      <ReviewSection
        title="Suppliers"
        editTo="/products/new/suppliers"
        status={
          state.skippedSteps.includes('suppliers')
            ? 'Skipped'
            : undefined
        }
      >
        {state.skippedSteps.includes('suppliers') ||
        state.draft.suppliers.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No suppliers are linked.
          </p>
        ) : (
          <div className="grid gap-3">
            {state.draft.suppliers.map((link) => {
              const supplier = suppliers.find(
                (item) => item.id === link.supplierId,
              );

              return (
                <div
                  key={link.temporaryId}
                  className="rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-text-primary">
                      {supplier?.name ?? 'Unknown supplier'}
                    </p>
                    {link.preferred && (
                      <span className="text-xs font-semibold text-brand-default">
                        Preferred
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    Purchase price: {formatMoney(link.purchasePrice, currency)}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Lead time:{' '}
                    {link.leadTimeDays
                      ? `${link.leadTimeDays} days`
                      : 'Not set'}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </ReviewSection>

      <ReviewSection
        title="Customers"
        editTo="/products/new/customers"
        status={
          state.skippedSteps.includes('customers')
            ? 'Skipped'
            : undefined
        }
      >
        {state.skippedSteps.includes('customers') ? (
          <p className="text-sm text-text-secondary">
            Customer availability will use the default for this product type.
          </p>
        ) : (
          <>
            <ReviewRow
              label="Availability"
              value={commercial.availability}
            />
            <ReviewRow
              label="Default price"
              value={formatMoney(
                commercial.defaultSellingPrice,
                currency,
              )}
            />
            {commercial.customers.map((link) => {
              const customer = customers.find(
                (item) => item.id === link.customerId,
              );

              return (
                <div
                  key={link.temporaryId}
                  className="mt-3 rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3"
                >
                  <p className="font-medium text-text-primary">
                    {customer?.name ?? 'Unknown customer'}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Selling price: {formatMoney(link.sellingPrice, currency)}
                  </p>
                </div>
              );
            })}
          </>
        )}
      </ReviewSection>
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  editTo:
    | '/products/new'
    | '/products/new/inventory'
    | '/products/new/suppliers'
    | '/products/new/customers';
  status?: string;
  children: ReactNode;
}

function ReviewSection({
  title,
  editTo,
  status,
  children,
}: ReviewSectionProps) {
  return (
    <section className="rounded-xl border border-border-subtle">
      <header className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          {status && (
            <span className="text-xs font-medium text-text-secondary">
              {status}
            </span>
          )}
        </div>
        <Link
          to={editTo}
          className="text-sm font-semibold text-brand-default hover:text-brand-hover"
        >
          Edit
        </Link>
      </header>
      <div className="grid gap-3 px-5 py-5">{children}</div>
    </section>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_minmax(0,1fr)]">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="text-sm font-medium text-text-primary">{value}</dd>
    </div>
  );
}
