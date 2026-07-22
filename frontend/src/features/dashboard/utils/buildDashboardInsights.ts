import type {
  DashboardOverview,
} from '../types/dashboard';
import type {
  DashboardInsight,
} from '../types/dashboardViewModel';
import {
  hasActiveSupplier,
  isLowStock,
  isOutOfStock,
} from './dashboardRules';

const productTypeLabels = {
  finished_good: 'Finished goods',
  raw_material: 'Raw materials',
  component: 'Components',
  consumable: 'Consumables',
  packaging: 'Packaging products',
  other: 'Other products',
} as const;

export function buildDashboardInsights(
  overview: DashboardOverview,
  lowStockEnabled: boolean,
): DashboardInsight[] {
  const activeProducts = overview.products.filter(
    (product) => product.active,
  );
  const activeSupplierIds = new Set(
    overview.activeSupplierIds,
  );
  const stockRiskProducts = activeProducts.filter(
    (product) =>
      isOutOfStock(product) ||
      isLowStock(product, lowStockEnabled),
  );
  const noSupplierCount = activeProducts.filter(
    (product) =>
      !hasActiveSupplier(product, activeSupplierIds),
  ).length;
  const insights: DashboardInsight[] = [];

  if (stockRiskProducts.length > 0) {
    insights.push({
      id: 'stock-risk',
      title: `${stockRiskProducts.length} ${stockRiskProducts.length === 1 ? 'product is' : 'products are'} below a healthy stock level.`,
      description:
        'Out-of-stock products and items at their configured reorder level need replenishment review.',
      tone: 'warning',
    });
  }

  if (noSupplierCount > 0) {
    insights.push({
      id: 'supplier-coverage',
      title: `${noSupplierCount} ${noSupplierCount === 1 ? 'product has' : 'products have'} no active supplier.`,
      description:
        'Supplier coverage makes low-stock warnings easier to turn into replenishment action.',
      tone: 'warning',
    });
  }

  if (stockRiskProducts.length > 0) {
    const counts = new Map<string, number>();

    for (const product of stockRiskProducts) {
      counts.set(
        product.type,
        (counts.get(product.type) ?? 0) + 1,
      );
    }

    const leadingType = [...counts.entries()].sort(
      (first, second) =>
        second[1] - first[1] ||
        first[0].localeCompare(second[0]),
    )[0];

    if (leadingType) {
      const [type, count] = leadingType;

      insights.push({
        id: 'risk-concentration',
        title: `${productTypeLabels[type as keyof typeof productTypeLabels]} represent the largest share of stock risk.`,
        description: `${count} ${count === 1 ? 'product in this category needs' : 'products in this category need'} attention.`,
        tone: 'neutral',
      });
    }
  }

  const capturedAt = new Date(
    overview.capturedAt,
  ).getTime();
  const recentCutoff =
    capturedAt - 30 * 24 * 60 * 60 * 1000;
  const recentProductCount = overview.products.filter(
    (product) => {
      const createdAt = new Date(
        product.createdAt,
      ).getTime();

      return (
        Number.isFinite(createdAt) &&
        createdAt >= recentCutoff &&
        createdAt <= capturedAt
      );
    },
  ).length;

  if (recentProductCount > 0) {
    insights.push({
      id: 'recent-products',
      title: `${recentProductCount} ${recentProductCount === 1 ? 'product was' : 'products were'} created in the last 30 days.`,
      description:
        'New catalog entries are included in current health and risk calculations.',
      tone: 'neutral',
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'no-major-changes',
      title: 'No major inventory changes detected.',
      description:
        'Active products are currently above their stock thresholds with supplier coverage in place.',
      tone: 'positive',
    });
  }

  return insights.slice(0, 4);
}
