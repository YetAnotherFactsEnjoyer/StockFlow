import type {
  CreateProductRequest,
} from '../types/product';
import type {
  ProductCreationState,
} from '../types/productCreation';

function toNullableText(value: string) {
  return value.trim() || null;
}

function toNullableNumber(value: string) {
  const normalizedValue = value.trim();
  return normalizedValue
    ? Number(normalizedValue)
    : null;
}

export function buildFullProductRequest(
  state: ProductCreationState,
): CreateProductRequest {
  const {
    details,
    inventory,
    suppliers,
    commercial,
  } = state.draft;

  if (
    !details.name.trim() ||
    !details.type ||
    !details.stockUnit
  ) {
    throw new Error(
      'Complete the required product details before creating the product.',
    );
  }

  const inventoryCompleted =
    state.completedSteps.includes('inventory');
  const suppliersCompleted =
    state.completedSteps.includes('suppliers');
  const customersCompleted =
    state.completedSteps.includes('customers');
  const defaultAvailability =
    details.type === 'finished_good'
      ? 'all_customers'
      : 'internal';
  const availability =
    customersCompleted &&
    commercial.availability !== 'unconfigured'
      ? commercial.availability
      : defaultAvailability;

  return {
    details: {
      name: details.name.trim(),
      sku: toNullableText(details.sku),
      description:
        toNullableText(details.description),
      type: details.type,
      stockUnit: details.stockUnit,
      customStockUnit:
        details.stockUnit === 'custom'
          ? toNullableText(details.customStockUnit)
          : null,
    },
    inventory: inventoryCompleted
      ? {
          initialQuantity:
            Number(inventory.initialQuantity),
          reorderLevel:
            toNullableNumber(inventory.reorderLevel),
          barcode: toNullableText(inventory.barcode),
        }
      : undefined,
    suppliers:
      suppliersCompleted && suppliers.length > 0
        ? suppliers.map((supplier) => ({
            supplierId: supplier.supplierId,
            supplierSku:
              toNullableText(supplier.supplierSku),
            purchasePrice:
              toNullableNumber(supplier.purchasePrice),
            minimumOrderQuantity:
              toNullableNumber(
                supplier.minimumOrderQuantity,
              ),
            leadTimeDays:
              toNullableNumber(supplier.leadTimeDays),
            preferred: supplier.preferred,
          }))
        : undefined,
    commercial: {
      availability,
      defaultSellingPrice:
        availability === 'internal'
          ? null
          : toNullableNumber(
              commercial.defaultSellingPrice,
            ),
      customers:
        availability === 'selected_customers' &&
        customersCompleted
          ? commercial.customers.map((customer) => ({
              customerId: customer.customerId,
              customerSku:
                toNullableText(customer.customerSku),
              sellingPrice:
                toNullableNumber(customer.sellingPrice),
              minimumOrderQuantity:
                toNullableNumber(
                  customer.minimumOrderQuantity,
                ),
            }))
          : [],
    },
  };
}
