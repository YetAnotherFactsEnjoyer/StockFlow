import type {
  DashboardProductSnapshot,
} from '../types/dashboard';
import type {
  DashboardRiskStatus,
} from '../types/dashboardViewModel';

export function isOutOfStock(
  product: DashboardProductSnapshot,
) {
  return product.stockQuantity <= 0;
}

export function isLowStock(
  product: DashboardProductSnapshot,
  lowStockEnabled: boolean,
) {
  return (
    lowStockEnabled &&
    product.stockQuantity > 0 &&
    product.reorderLevel !== null &&
    product.stockQuantity <= product.reorderLevel
  );
}

export function hasActiveSupplier(
  product: DashboardProductSnapshot,
  activeSupplierIds: ReadonlySet<string>,
) {
  return product.supplierIds.some((supplierId) =>
    activeSupplierIds.has(supplierId),
  );
}

export function hasActiveCustomer(
  product: DashboardProductSnapshot,
  activeCustomerIds: ReadonlySet<string>,
) {
  return product.customerIds.some((customerId) =>
    activeCustomerIds.has(customerId),
  );
}

export function getPrimaryRisk(
  product: DashboardProductSnapshot,
  lowStockEnabled: boolean,
  activeSupplierIds: ReadonlySet<string>,
): DashboardRiskStatus {
  if (isOutOfStock(product)) {
    return 'out_of_stock';
  }

  if (isLowStock(product, lowStockEnabled)) {
    return 'low_stock';
  }

  if (!hasActiveSupplier(product, activeSupplierIds)) {
    return 'no_supplier';
  }

  return 'healthy';
}
