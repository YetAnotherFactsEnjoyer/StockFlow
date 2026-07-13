import type {
  ProductDetailsDraft,
} from '../types/productCreation';

export type ProductDetailsErrors = Partial<
  Record<keyof ProductDetailsDraft, string>
>;

interface ProductDetailsValidationOptions {
  skuRequired: boolean;
}

export function validateProductDetails(
  details: ProductDetailsDraft,
  options: ProductDetailsValidationOptions,
): ProductDetailsErrors {
  const errors: ProductDetailsErrors = {};

  const name = details.name.trim();
  const sku = details.sku.trim();
  const customStockUnit =
    details.customStockUnit.trim();

  if (!name) {
    errors.name = 'Enter a product name.';
  } else if (name.length > 120) {
    errors.name =
      'Product name must be 120 characters or fewer.';
  }

  if (options.skuRequired && !sku) {
    errors.sku = 'Enter an internal SKU.';
  } else if (sku.length > 64) {
    errors.sku =
      'SKU must be 64 characters or fewer.';
  }

  if (!details.type) {
    errors.type = 'Select a product type.';
  }

  if (!details.stockUnit) {
    errors.stockUnit = 'Select a stock unit.';
  }

  if (
    details.stockUnit === 'custom' &&
    !customStockUnit
  ) {
    errors.customStockUnit =
      'Enter the custom stock unit.';
  } else if (customStockUnit.length > 40) {
    errors.customStockUnit =
      'Custom stock unit must be 40 characters or fewer.';
  }

  if (details.description.length > 500) {
    errors.description =
      'Description must be 500 characters or fewer.';
  }

  return errors;
}

export function hasProductDetailsErrors(
  errors: ProductDetailsErrors,
) {
  return Object.keys(errors).length > 0;
}
