import {
  useId,
  type ReactNode,
} from 'react';
import {
  FiActivity,
  FiBarChart2,
  FiPackage,
  FiTruck,
  FiX,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';
import type {
  Product,
} from '../types/product';
import {
  formatProductMoney,
  getStockUnitLabel,
} from '../utils/productPresentation';
import {
  ProductDialogFrame,
} from './ProductDialogFrame';

interface ProductTrendsDialogProps {
  product: Product;
  currency: string;
  onClose: () => void;
}

export function ProductTrendsDialog({
  product,
  currency,
  onClose,
}: ProductTrendsDialogProps) {
  const titleId = useId();
  const unit = getStockUnitLabel(
    product.stockUnit,
    product.customStockUnit,
  );

  return (
    <ProductDialogFrame titleId={titleId} layout="wide" onClose={onClose}>
      <header className="flex items-start justify-between gap-4 border-b border-border-subtle px-6 py-5">
        <div>
          <h2 id={titleId} className="text-xl font-semibold text-text-primary">
            Product trends
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {product.name} · {product.sku || 'No SKU'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close product trends"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-xl text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
        >
          <FiX aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TrendMetric
            icon={<FiPackage />}
            label="Current stock"
            value={`${product.stockQuantity.toLocaleString()} ${unit}`}
          />
          <TrendMetric
            icon={<FiActivity />}
            label="Reorder level"
            value={
              product.reorderLevel === null
                ? 'Not set'
                : `${product.reorderLevel.toLocaleString()} ${unit}`
            }
          />
          <TrendMetric
            icon={<FiTruck />}
            label="Suppliers"
            value={String((product.suppliers ?? []).length)}
          />
          <TrendMetric
            icon={<FiBarChart2 />}
            label="Selling price"
            value={formatProductMoney(product.defaultSellingPrice, currency)}
          />
        </div>

        <section className="mt-6 rounded-2xl border border-border-subtle bg-surface-secondary/40 p-6">
          <div>
            <h3 className="font-semibold text-text-primary">Inventory movement</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Stock received, consumed, and adjusted · Last 7 days
            </p>
          </div>
          <div className="mt-6 grid min-h-64 place-items-center rounded-xl border border-dashed border-border-subtle bg-surface px-6 text-center">
            <div className="max-w-md">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand-default">
                <FiActivity aria-hidden="true" className="size-5" />
              </span>
              <h4 className="mt-4 font-semibold text-text-primary">
                No movement history yet
              </h4>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Stock received, consumed, and adjusted will appear here once
                inventory movements are recorded.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="flex justify-end border-t border-border-subtle px-6 py-4">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </footer>
    </ProductDialogFrame>
  );
}

function TrendMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-border-subtle bg-surface p-4">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand-default">
        {icon}
      </span>
      <p className="mt-4 text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold text-text-primary">{value}</p>
    </article>
  );
}
