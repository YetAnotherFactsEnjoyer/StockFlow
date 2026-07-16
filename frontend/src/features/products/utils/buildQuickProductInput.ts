import type {
  CreateProductRequest,
} from '../types/product';
import type {
  ProductCreationDefaults,
  ProductDetailsDraft,
} from '../types/productCreation';

export function buildQuickProductRequest(
  details: ProductDetailsDraft,
  defaults: ProductCreationDefaults,
): CreateProductRequest {
  if (!details.type || !details.stockUnit) {
    throw new Error(
      'Product details must be valid before creating a product.',
    );
  }

  const availability =
    details.type === 'finished_good'
      ? 'all_customers'
      : 'internal';

  return {
    details: {
      name: details.name.trim(),
      sku: details.sku.trim() || null,
      description:
        details.description.trim() || null,
      type: details.type,
      stockUnit: details.stockUnit,
      customStockUnit:
        details.stockUnit === 'custom'
          ? details.customStockUnit.trim()
          : null,
    },
    inventory: {
      initialQuantity: 0,
      reorderLevel: defaults.lowStockEnabled
        ? defaults.defaultLowStockThreshold
        : null,
      barcode: null,
    },
    commercial: {
      availability,
      defaultSellingPrice: null,
      customers: [],
    },
  };
}
