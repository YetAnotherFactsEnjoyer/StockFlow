import type {
  CreateProductInput,
} from '../types/product';
import type {
  ProductCreationDefaults,
  ProductDetailsDraft,
} from '../types/productCreation';

export function buildQuickProductInput(
  details: ProductDetailsDraft,
  defaults: ProductCreationDefaults,
): CreateProductInput {
  if (
    !details.type ||
    !details.stockUnit
  ) {
    throw new Error(
      'Product details must be valid before creating a product.',
    );
  }

  const isFinishedGood =
    details.type ===
    'finished_good';

  return {
    name: details.name.trim(),

    sku:
      details.sku.trim() ||
      null,

    description:
      details.description.trim() ||
      null,

    type: details.type,

    stockUnit:
      details.stockUnit,

    customStockUnit:
      details.stockUnit === 'custom'
        ? details.customStockUnit.trim()
        : null,

    initialQuantity: 0,

    reorderLevel:
      defaults.lowStockEnabled
        ? defaults.defaultLowStockThreshold
        : null,

    barcode: null,

    availability:
      isFinishedGood
        ? 'all_customers'
        : 'internal',
  };
}
