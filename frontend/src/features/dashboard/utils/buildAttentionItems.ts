import type {
  OnboardingState,
} from '../../onboarding/types/onboarding';
import type {
  DashboardOverview,
  DashboardProductSnapshot,
} from '../types/dashboard';
import type {
  DashboardAttentionItem,
} from '../types/dashboardViewModel';
import {
  hasActiveCustomer,
  hasActiveSupplier,
  isLowStock,
  isOutOfStock,
} from './dashboardRules';

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

function buildProductItems(
  product: DashboardProductSnapshot,
  overview: DashboardOverview,
  workspace: OnboardingState,
): DashboardAttentionItem[] {
  const items: DashboardAttentionItem[] = [];
  const activeSupplierIds = new Set(
    overview.activeSupplierIds,
  );
  const activeCustomerIds = new Set(
    overview.activeCustomerIds,
  );
  const stockMetadata = [
    `Current stock: ${formatNumber(product.stockQuantity)}`,
  ];

  if (product.reorderLevel !== null) {
    stockMetadata.push(
      `Reorder threshold: ${formatNumber(product.reorderLevel)}`,
    );
  }

  if (isOutOfStock(product)) {
    items.push({
      id: `out_of_stock:${product.id}`,
      productId: product.id,
      severity: 'critical',
      severityLabel: 'Critical',
      title: `${product.name} is out of stock.`,
      description:
        'This product cannot support new demand until stock is replenished.',
      metadata: stockMetadata,
      actionLabel: 'Review product',
      actionTo: '/products',
    });
  } else if (
    isLowStock(
      product,
      workspace.inventory.lowStockEnabled,
    )
  ) {
    items.push({
      id: `low_stock:${product.id}`,
      productId: product.id,
      severity: 'warning',
      severityLabel: 'Warning',
      title: `${product.name} has reached its reorder level.`,
      description:
        'Review replenishment before the remaining stock is consumed.',
      metadata: stockMetadata,
      actionLabel: 'Review product',
      actionTo: '/products',
    });
  }

  if (!hasActiveSupplier(product, activeSupplierIds)) {
    const hasLinks = product.supplierIds.length > 0;

    items.push({
      id: `no_supplier:${product.id}`,
      productId: product.id,
      severity: 'warning',
      severityLabel: 'Configuration',
      title: `${product.name} has no active supplier.`,
      description: hasLinks
        ? 'Its linked supplier is unavailable. Link an active supplier to keep replenishment actionable.'
        : 'Link a supplier so the team knows where to source this product.',
      metadata: [
        hasLinks
          ? `Supplier links: ${product.supplierIds.length} unavailable`
          : 'Supplier links: 0',
      ],
      actionLabel: 'Configure supplier',
      actionTo: '/products',
    });
  }

  if (
    product.availability === 'selected_customers' &&
    !hasActiveCustomer(product, activeCustomerIds)
  ) {
    items.push({
      id: `missing_customer:${product.id}`,
      productId: product.id,
      severity: 'warning',
      severityLabel: 'Configuration',
      title: `${product.name} has no active customer link.`,
      description:
        'Selected-customer availability needs at least one active customer assignment.',
      metadata: [
        `Customer links: ${product.customerIds.length}`,
      ],
      actionLabel: 'Configure customers',
      actionTo: '/products',
    });
  }

  if (
    workspace.inventory.skuRequired &&
    !product.sku?.trim()
  ) {
    items.push({
      id: `missing_sku:${product.id}`,
      productId: product.id,
      severity: 'warning',
      severityLabel: 'Configuration',
      title: `${product.name} is missing a required SKU.`,
      description:
        'Add a SKU so this product can be identified consistently across inventory operations.',
      metadata: ['SKU: Not configured'],
      actionLabel: 'Add SKU',
      actionTo: '/products',
    });
  }

  return items;
}

const severityRank = {
  critical: 0,
  warning: 1,
  information: 2,
} as const;

const ruleRank = [
  'out_of_stock',
  'low_stock',
  'no_supplier',
  'missing_customer',
  'missing_sku',
];

export function buildAttentionItems(
  overview: DashboardOverview,
  workspace: OnboardingState,
) {
  return overview.products
    .filter((product) => product.active)
    .flatMap((product) =>
      buildProductItems(
        product,
        overview,
        workspace,
      ),
    )
    .sort((first, second) => {
      const severityDifference =
        severityRank[first.severity] -
        severityRank[second.severity];

      if (severityDifference !== 0) {
        return severityDifference;
      }

      const firstRule = first.id.split(':')[0];
      const secondRule = second.id.split(':')[0];
      const ruleDifference =
        ruleRank.indexOf(firstRule) -
        ruleRank.indexOf(secondRule);

      if (ruleDifference !== 0) {
        return ruleDifference;
      }

      return first.title.localeCompare(second.title);
    });
}
