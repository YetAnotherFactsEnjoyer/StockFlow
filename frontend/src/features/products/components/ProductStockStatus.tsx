import type {
  Product,
} from '../types/product';
import {
  getProductStockState,
  getStockUnitLabel,
} from '../utils/productPresentation';

type ProductStockStatusProps = Pick<
  Product,
  | 'stockQuantity'
  | 'reorderLevel'
  | 'stockUnit'
  | 'customStockUnit'
>;

const statePresentation = {
  healthy: {
    label: 'Healthy',
    text: 'text-success',
    dot: 'bg-success',
  },
  low_stock: {
    label: 'Low stock',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  out_of_stock: {
    label: 'Out of stock',
    text: 'text-danger',
    dot: 'bg-danger',
  },
} as const;

export function ProductStockStatus({
  stockQuantity,
  reorderLevel,
  stockUnit,
  customStockUnit,
}: ProductStockStatusProps) {
  const state = getProductStockState({
    stockQuantity,
    reorderLevel,
  });
  const presentation = statePresentation[state];

  return (
    <div className="grid gap-1">
      <span className="whitespace-nowrap text-sm font-semibold text-text-primary">
        {stockQuantity.toLocaleString()}{' '}
        <span className="font-normal text-text-secondary">
          {getStockUnitLabel(
            stockUnit,
            customStockUnit,
          )}
        </span>
      </span>

      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium ${presentation.text}`}
      >
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${presentation.dot}`}
        />
        {presentation.label}
      </span>
    </div>
  );
}
