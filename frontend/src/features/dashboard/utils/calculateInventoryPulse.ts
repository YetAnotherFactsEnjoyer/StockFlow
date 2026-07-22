import type {
  DashboardProductSnapshot,
} from '../types/dashboard';
import type {
  InventoryPulseFactorViewModel,
  InventoryPulseViewModel,
} from '../types/dashboardViewModel';
import {
  hasActiveSupplier,
  isLowStock,
  isOutOfStock,
} from './dashboardRules';

function factorScore(
  healthyCount: number,
  totalCount: number,
  maximum: number,
) {
  if (totalCount === 0) {
    return 0;
  }

  return Math.round(
    (healthyCount / totalCount) * maximum,
  );
}

export function calculateInventoryPulse(
  products: DashboardProductSnapshot[],
  activeSupplierIds: ReadonlySet<string>,
  lowStockEnabled: boolean,
): InventoryPulseViewModel | null {
  const activeProducts = products.filter(
    (product) => product.active,
  );

  if (activeProducts.length === 0) {
    return null;
  }

  const inStockCount = activeProducts.filter(
    (product) => !isOutOfStock(product),
  ).length;
  const stockRiskCount = activeProducts.filter(
    (product) =>
      isOutOfStock(product) ||
      isLowStock(product, lowStockEnabled),
  ).length;
  const coveredCount = activeProducts.filter(
    (product) =>
      hasActiveSupplier(product, activeSupplierIds),
  ).length;

  const factors: InventoryPulseFactorViewModel[] = [
    {
      id: 'availability',
      label: 'Product availability',
      score: factorScore(
        inStockCount,
        activeProducts.length,
        35,
      ),
      maximum: 35,
      explanation: `${inStockCount} of ${activeProducts.length} active products have stock available.`,
    },
    {
      id: 'stock-exposure',
      label: 'Low-stock exposure',
      score: factorScore(
        activeProducts.length - stockRiskCount,
        activeProducts.length,
        25,
      ),
      maximum: 25,
      explanation: `${stockRiskCount} active ${stockRiskCount === 1 ? 'product is' : 'products are'} at or below a stock risk threshold.`,
    },
    {
      id: 'supplier-coverage',
      label: 'Supplier coverage',
      score: factorScore(
        coveredCount,
        activeProducts.length,
        20,
      ),
      maximum: 20,
      explanation: `${coveredCount} of ${activeProducts.length} active products have an active supplier.`,
    },
    {
      id: 'catalog-readiness',
      label: 'Catalog readiness',
      score: factorScore(
        activeProducts.length,
        products.length,
        20,
      ),
      maximum: 20,
      explanation: `${activeProducts.length} of ${products.length} catalog products are active.`,
    },
  ];

  const score = factors.reduce(
    (total, factor) => total + factor.score,
    0,
  );
  const status =
    score >= 85
      ? 'healthy'
      : score >= 65
        ? 'stable'
        : 'at_risk';

  return {
    score,
    status,
    statusLabel:
      status === 'healthy'
        ? 'Healthy'
        : status === 'stable'
          ? 'Stable'
          : 'At risk',
    change: null,
    factors,
  };
}
