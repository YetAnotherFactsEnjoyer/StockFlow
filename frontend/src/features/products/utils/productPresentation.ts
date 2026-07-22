import type {
  ConfiguredCustomerAvailability,
  Product,
} from '../types/product';
import type {
  ProductType,
  StockUnit,
} from '../types/productCreation';

export type ProductStockState =
  | 'healthy'
  | 'low_stock'
  | 'out_of_stock';

export const productTypeLabels: Record<
  ProductType,
  string
> = {
  finished_good: 'Finished good',
  raw_material: 'Raw material',
  component: 'Component',
  consumable: 'Consumable',
  packaging: 'Packaging',
  other: 'Other',
};

export const availabilityLabels: Record<
  ConfiguredCustomerAvailability,
  string
> = {
  internal: 'Internal only',
  all_customers: 'All customers',
  selected_customers: 'Selected customers',
};

const stockUnitLabels: Record<StockUnit, string> = {
  unit: 'units',
  kilogram: 'kg',
  gram: 'g',
  liter: 'L',
  meter: 'm',
  box: 'boxes',
  pallet: 'pallets',
  custom: 'units',
};

export function getStockUnitLabel(
  stockUnit: StockUnit,
  customStockUnit: string | null,
) {
  if (stockUnit === 'custom') {
    return customStockUnit?.trim() || 'units';
  }

  return stockUnitLabels[stockUnit];
}

export function getProductStockState(
  product: Pick<
    Product,
    'stockQuantity' | 'reorderLevel'
  >,
): ProductStockState {
  if (product.stockQuantity <= 0) {
    return 'out_of_stock';
  }

  if (
    product.reorderLevel !== null &&
    product.stockQuantity <= product.reorderLevel
  ) {
    return 'low_stock';
  }

  return 'healthy';
}

export function formatProductDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatProductMoney(
  value: number | null,
  currency: string,
) {
  if (value === null) {
    return 'Not set';
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(value);
}
