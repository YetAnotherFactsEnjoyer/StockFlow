import type {
  OnboardingState,
} from '../../onboarding/types/onboarding';
import type {
  ProductType,
} from '../../products/types/productCreation';
import type {
  DashboardFeed,
  DashboardMovementRaw,
  DashboardOverview,
} from '../types/dashboard';
import type {
  DashboardActivityItem,
  DashboardDeliveriesViewModel,
  DashboardMovementViewModel,
  DashboardPeriod,
  DashboardPeriodData,
  DashboardPeriodOption,
  DashboardRiskGroup,
  DashboardRiskStatus,
  DashboardRiskViewModel,
  DashboardStockFlowSegment,
  DashboardViewModel,
} from '../types/dashboardViewModel';
import {
  buildAttentionItems,
} from './buildAttentionItems';
import {
  buildDashboardInsights,
} from './buildDashboardInsights';
import {
  calculateInventoryPulse,
} from './calculateInventoryPulse';
import {
  getPrimaryRisk,
  isLowStock,
  isOutOfStock,
} from './dashboardRules';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const dashboardPeriods: DashboardPeriodOption[] = [
  { id: '7d', label: 'Last 7 days', days: 7 },
  { id: '30d', label: 'Last 30 days', days: 30 },
  { id: '90d', label: 'Last 90 days', days: 90 },
];

const productTypeLabels: Record<ProductType, string> = {
  finished_good: 'Finished goods',
  raw_material: 'Raw materials',
  component: 'Components',
  consumable: 'Consumables',
  packaging: 'Packaging',
  other: 'Other',
};

const productTypes = Object.keys(
  productTypeLabels,
) as ProductType[];

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function buildStockFlow(
  overview: DashboardOverview,
  lowStockEnabled: boolean,
): DashboardStockFlowSegment[] {
  const activeProducts = overview.products.filter(
    (product) => product.active,
  );
  const inStockCount = activeProducts.filter(
    (product) => !isOutOfStock(product),
  ).length;
  const outOfStockCount = activeProducts.filter(
    isOutOfStock,
  ).length;
  const atRiskCount = activeProducts.filter(
    (product) =>
      isOutOfStock(product) ||
      isLowStock(product, lowStockEnabled),
  ).length;

  return [
    {
      id: 'active',
      label: 'Active products',
      value: formatNumber(activeProducts.length),
      helper: 'Included in health checks',
      tone: 'neutral',
      route: '/products',
    },
    {
      id: 'in_stock',
      label: 'Products in stock',
      value: formatNumber(inStockCount),
      helper: 'Stock quantity above zero',
      tone: 'positive',
      route: '/products',
    },
    {
      id: 'at_risk',
      label: 'At risk',
      value: formatNumber(atRiskCount),
      helper: 'Low or out of stock',
      tone: 'warning',
      route: '/products',
    },
    {
      id: 'out_of_stock',
      label: 'Out of stock',
      value: formatNumber(outOfStockCount),
      helper: 'Requires replenishment',
      tone: 'critical',
      route: '/products',
    },
  ];
}

function emptyRiskCounts(): Record<
  DashboardRiskStatus,
  number
> {
  return {
    healthy: 0,
    low_stock: 0,
    out_of_stock: 0,
    no_supplier: 0,
  };
}

function buildRisk(
  overview: DashboardOverview,
  lowStockEnabled: boolean,
): DashboardRiskViewModel {
  const activeSupplierIds = new Set(
    overview.activeSupplierIds,
  );
  const activeProducts = overview.products.filter(
    (product) => product.active,
  );
  const groups: DashboardRiskGroup[] = productTypes.map(
    (type) => ({
      id: type,
      label: productTypeLabels[type],
      counts: emptyRiskCounts(),
    }),
  );
  const groupByType = new Map(
    groups.map((group) => [group.id, group]),
  );
  const totals = emptyRiskCounts();

  for (const product of activeProducts) {
    const status = getPrimaryRisk(
      product,
      lowStockEnabled,
      activeSupplierIds,
    );
    totals[status] += 1;
    const group = groupByType.get(product.type);

    if (group) {
      group.counts[status] += 1;
    }
  }

  const categories = [
    {
      id: 'healthy' as const,
      label: 'Healthy',
      count: totals.healthy,
      description: 'Stocked with supplier coverage',
      tone: 'positive' as const,
    },
    {
      id: 'low_stock' as const,
      label: 'Low stock',
      count: totals.low_stock,
      description: 'At or below reorder level',
      tone: 'warning' as const,
    },
    {
      id: 'no_supplier' as const,
      label: 'No supplier',
      count: totals.no_supplier,
      description: 'No active sourcing link',
      tone: 'neutral' as const,
    },
    {
      id: 'out_of_stock' as const,
      label: 'Out of stock',
      count: totals.out_of_stock,
      description: 'No stock available',
      tone: 'critical' as const,
    },
  ];

  const percentage = (value: number) =>
    activeProducts.length > 0
      ? Math.round(
          (value / activeProducts.length) * 100,
        )
      : 0;
  const outOfStockPercentage = percentage(
    totals.out_of_stock,
  );
  const lowStockPercentage = percentage(
    totals.low_stock,
  );
  const noSupplierPercentage = percentage(
    totals.no_supplier,
  );
  const interpretation =
    activeProducts.length === 0
      ? 'Activate a product to begin assessing inventory risk.'
      : outOfStockPercentage > 10
        ? `${outOfStockPercentage}% of active products are out of stock and need immediate replenishment review.`
        : lowStockPercentage > 20
          ? 'Stockout exposure is elevated because a high share of products are at their reorder level.'
          : noSupplierPercentage > 15
            ? 'Supplier coverage is the main inventory risk across the active catalog.'
            : 'Inventory is generally in a healthy operational state.';

  return {
    totalProducts: activeProducts.length,
    categories,
    groups,
    textSummary:
      activeProducts.length === 0
        ? 'No active products are available for risk analysis.'
        : `${totals.healthy} healthy, ${totals.low_stock} low stock, ${totals.out_of_stock} out of stock, and ${totals.no_supplier} without an active supplier.`,
    interpretation,
  };
}

function buildMovement(
  feed: DashboardFeed<DashboardMovementRaw>,
  period: DashboardPeriodOption,
  capturedAt: string,
): DashboardMovementViewModel {
  if (feed.status === 'unavailable') {
    return {
      status: 'unavailable',
      points: [],
      textSummary:
        'Stock movement tracking is not configured yet.',
    };
  }

  const referenceTime = new Date(capturedAt).getTime();
  const cutoff =
    referenceTime - period.days * MILLISECONDS_PER_DAY;
  const movements = feed.items.filter((movement) => {
    const occurredAt = new Date(
      movement.occurredAt,
    ).getTime();

    return (
      Number.isFinite(occurredAt) &&
      occurredAt >= cutoff &&
      occurredAt <= referenceTime
    );
  });

  if (movements.length === 0) {
    return {
      status: 'empty',
      points: [],
      textSummary: `No stock movements were recorded in the ${period.label.toLowerCase()}.`,
    };
  }

  const pointsByDate = new Map<
    string,
    {
      received: number;
      consumed: number;
      adjusted: number;
    }
  >();

  for (const movement of movements) {
    const date = new Date(movement.occurredAt)
      .toISOString()
      .slice(0, 10);
    const point = pointsByDate.get(date) ?? {
      received: 0,
      consumed: 0,
      adjusted: 0,
    };

    if (movement.type === 'received') {
      point.received += Math.abs(movement.quantity);
    } else if (movement.type === 'consumed') {
      point.consumed += Math.abs(movement.quantity);
    } else {
      point.adjusted += movement.quantity;
    }

    pointsByDate.set(date, point);
  }

  const points = [...pointsByDate.entries()]
    .sort(([first], [second]) =>
      first.localeCompare(second),
    )
    .map(([date, values]) => ({
      date,
      label: formatShortDate(date),
      ...values,
    }));
  const totals = points.reduce(
    (total, point) => ({
      received: total.received + point.received,
      consumed: total.consumed + point.consumed,
      adjusted: total.adjusted + point.adjusted,
    }),
    { received: 0, consumed: 0, adjusted: 0 },
  );

  return {
    status: 'ready',
    points,
    textSummary: `${formatNumber(totals.received)} received, ${formatNumber(totals.consumed)} consumed, and ${formatNumber(totals.adjusted)} net adjusted in the ${period.label.toLowerCase()}.`,
  };
}

function buildActivities(
  overview: DashboardOverview,
  period: DashboardPeriodOption,
): DashboardActivityItem[] {
  const referenceTime = new Date(
    overview.capturedAt,
  ).getTime();
  const cutoff =
    referenceTime - period.days * MILLISECONDS_PER_DAY;
  const items: DashboardActivityItem[] = [];

  for (const product of overview.products) {
    const createdAt = new Date(
      product.createdAt,
    ).getTime();

    if (
      !Number.isFinite(createdAt) ||
      createdAt < cutoff ||
      createdAt > referenceTime
    ) {
      continue;
    }

    items.push({
      id: `product_created:${product.id}`,
      type: 'product_created',
      title: `${product.name} was created`,
      description: product.sku?.trim()
        ? `SKU ${product.sku} was added to the product catalog.`
        : 'A product without a configured SKU was added to the catalog.',
      occurredAt: product.createdAt,
      occurredAtLabel: formatDate(product.createdAt),
      route: '/products',
    });
  }

  if (overview.movements.status === 'available') {
    for (const movement of overview.movements.items) {
      const occurredAt = new Date(
        movement.occurredAt,
      ).getTime();

      if (
        !Number.isFinite(occurredAt) ||
        occurredAt < cutoff ||
        occurredAt > referenceTime
      ) {
        continue;
      }

      const type =
        movement.type === 'received'
          ? 'stock_received'
          : movement.type === 'consumed'
            ? 'stock_consumed'
            : 'stock_adjusted';
      const action =
        movement.type === 'received'
          ? 'received'
          : movement.type === 'consumed'
            ? 'consumed'
            : 'adjusted';

      items.push({
        id: `movement:${movement.id}`,
        type,
        title: `${movement.productName} stock was ${action}`,
        description: `${formatNumber(Math.abs(movement.quantity))} recorded in this inventory movement.`,
        occurredAt: movement.occurredAt,
        occurredAtLabel: formatDate(movement.occurredAt),
        route: '/products',
      });
    }
  }

  return items
    .sort((first, second) =>
      second.occurredAt.localeCompare(first.occurredAt),
    )
    .slice(0, 8);
}

function buildDeliveries(
  overview: DashboardOverview,
): DashboardDeliveriesViewModel {
  if (overview.upcomingDeliveries.status === 'unavailable') {
    return {
      status: 'unavailable',
      items: [],
    };
  }

  if (overview.upcomingDeliveries.items.length === 0) {
    return {
      status: 'empty',
      items: [],
    };
  }

  return {
    status: 'ready',
    items: overview.upcomingDeliveries.items.map(
      (delivery) => ({
        ...delivery,
        expectedDate: formatDate(
          delivery.expectedDate,
        ),
      }),
    ),
  };
}

export function buildDashboardViewModel(
  overview: DashboardOverview,
  workspace: OnboardingState,
): DashboardViewModel {
  const attentionItems = buildAttentionItems(
    overview,
    workspace,
  );
  const affectedProductCount = new Set(
    attentionItems.map((item) => item.productId),
  ).size;
  const activeSupplierIds = new Set(
    overview.activeSupplierIds,
  );
  const pulse = calculateInventoryPulse(
    overview.products,
    activeSupplierIds,
    workspace.inventory.lowStockEnabled,
  );
  const periodData = Object.fromEntries(
    dashboardPeriods.map((period) => [
      period.id,
      {
        movement: buildMovement(
          overview.movements,
          period,
          overview.capturedAt,
        ),
        activities: buildActivities(
          overview,
          period,
        ),
      } satisfies DashboardPeriodData,
    ]),
  ) as Record<DashboardPeriod, DashboardPeriodData>;
  const workspaceName =
    workspace.organization.name.trim() ||
    workspace.branding.applicationName.trim() ||
    'StockFlow';
  const state =
    overview.products.length === 0 ? 'empty' : 'ready';
  const statusDescription = pulse
    ? pulse.statusLabel.toLowerCase()
    : 'not yet measurable';

  return {
    state,
    header: {
      title: 'Inventory Control Center',
      eyebrow: workspaceName,
      summary:
        state === 'empty'
          ? 'Create your first product to begin tracking stock health, supplier coverage, and inventory activity.'
          : `Your inventory is ${statusDescription}, with ${affectedProductCount} ${affectedProductCount === 1 ? 'product' : 'products'} requiring attention.`,
      updatedLabel: overview.updatedAt
        ? `Last catalog update ${formatDate(overview.updatedAt)}`
        : null,
    },
    periods: dashboardPeriods,
    pulse,
    attention: {
      total: attentionItems.length,
      affectedProductCount,
      items: attentionItems.slice(0, 5),
      hasMore: attentionItems.length > 5,
    },
    stockFlow: buildStockFlow(
      overview,
      workspace.inventory.lowStockEnabled,
    ),
    risk: buildRisk(
      overview,
      workspace.inventory.lowStockEnabled,
    ),
    insights: buildDashboardInsights(
      overview,
      workspace.inventory.lowStockEnabled,
    ),
    deliveries: buildDeliveries(overview),
    periodData,
  };
}
