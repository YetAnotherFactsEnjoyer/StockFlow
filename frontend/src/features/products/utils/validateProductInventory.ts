import type {
  ProductInventoryDraft,
} from '../types/productCreation';

export type ProductInventoryErrors =
  Partial<
    Record<
      keyof ProductInventoryDraft,
      string
    >
  >;

interface ProductInventoryValidationOptions {
  lowStockEnabled: boolean;
  barcodeScanEnabled: boolean;
}

function isNonNegativeNumber(
  value: string,
) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return false;
  }

  const parsedValue = Number(
    normalizedValue,
  );

  return (
    Number.isFinite(parsedValue) &&
    parsedValue >= 0
  );
}

export function validateProductInventory(
  inventory: ProductInventoryDraft,
  options: ProductInventoryValidationOptions,
): ProductInventoryErrors {
  const errors: ProductInventoryErrors =
    {};

  if (
    !isNonNegativeNumber(
      inventory.initialQuantity,
    )
  ) {
    errors.initialQuantity =
      'Enter a quantity of zero or more.';
  }

  if (options.lowStockEnabled) {
    if (
      !isNonNegativeNumber(
        inventory.reorderLevel,
      )
    ) {
      errors.reorderLevel =
        'Enter a reorder threshold of zero or more.';
    }
  }

  if (
    options.barcodeScanEnabled &&
    inventory.barcode.trim().length > 128
  ) {
    errors.barcode =
      'Barcode must be 128 characters or fewer.';
  }

  return errors;
}

export function hasProductInventoryErrors(
  errors: ProductInventoryErrors,
) {
  return Object.keys(errors).length > 0;
}
