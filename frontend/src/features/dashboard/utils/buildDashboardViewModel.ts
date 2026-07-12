import type { OnboardingState } from '../../onboarding/types/onboarding';
import type {
  DashboardActivityItem,
  DashboardAttentionItem,
  DashboardOverview,
} from '../types/dashboard';
import type {
  DashboardActivityItemView,
  DashboardAttentionItemView,
  DashboardQuickAction,
  DashboardSummaryItem,
  DashboardViewModel,
} from '../types/dashboardViewModel';

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

function formatCurrency(
  value: number,
  currency: string,
) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function buildSummaryItems(
  overview: DashboardOverview,
  workspace: OnboardingState,
): DashboardSummaryItem[] {
  const items: DashboardSummaryItem[] = [
    {
      id: 'products',
      label: 'Total products',
      value: formatNumber(
        overview.summary.totalProducts,
      ),
      emphasis: 'default',
    },
  ];

  if (workspace.inventory.lowStockEnabled) {
    items.push({
      id: 'low-stock',
      label: 'Low stock',
      value: formatNumber(
        overview.summary.lowStockProducts,
      ),
      emphasis:
        overview.summary.lowStockProducts > 0
          ? 'warning'
          : 'default',
    });
  }

  if (
    workspace.inventory.trackPurchasePrice &&
    overview.summary.inventoryValue !== null
  ) {
    items.push({
      id: 'inventory-value',
      label: 'Inventory value',
      value: formatCurrency(
        overview.summary.inventoryValue,
        workspace.organization.currency,
      ),
      emphasis: 'default',
    });
  } else {
    items.push({
      id: 'total-units',
      label: 'Units in stock',
      value: formatNumber(
        overview.summary.totalUnits,
      ),
      emphasis: 'default',
    });
  }

  items.push({
    id: 'suppliers',
    label: 'Active suppliers',
    value: formatNumber(
      overview.summary.activeSuppliers,
    ),
    emphasis: 'default',
  });

  return items;
}

function buildAttentionItem(
  item: DashboardAttentionItem,
): DashboardAttentionItemView {
  return {
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    stockLabel: `${formatNumber(item.currentStock)} units`,
    thresholdLabel: `Reorder at ${formatNumber(
      item.reorderLevel,
    )}`,
    statusLabel:
      item.status === 'out_of_stock'
        ? 'Out of stock'
        : 'Low stock',
    severity:
      item.status === 'out_of_stock'
        ? 'critical'
        : 'warning',
  };
}

function getActivityLabels(
  item: DashboardActivityItem,
) {
  switch (item.type) {
    case 'stock_in':
      return {
        actionLabel: 'Stock received',
        quantityLabel: `+${formatNumber(
          Math.abs(item.quantity),
        )} units`,
        direction: 'positive' as const,
      };

    case 'stock_out':
      return {
        actionLabel: 'Stock removed',
        quantityLabel: `-${formatNumber(
          Math.abs(item.quantity),
        )} units`,
        direction: 'negative' as const,
      };

    case 'adjustment':
      return {
        actionLabel: 'Stock adjusted',
        quantityLabel: `${
          item.quantity > 0 ? '+' : ''
        }${formatNumber(item.quantity)} units`,
        direction: 'neutral' as const,
      };
  }
}

function buildActivityItem(
  item: DashboardActivityItem,
): DashboardActivityItemView {
  const labels = getActivityLabels(item);

  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    actionLabel: labels.actionLabel,
    quantityLabel: labels.quantityLabel,
    direction: labels.direction,
    performedByLabel: item.performedBy,
    dateLabel: formatDate(item.createdAt),
  };
}

function buildQuickActions(
  workspace: OnboardingState,
): DashboardQuickAction[] {
  const actions: DashboardQuickAction[] = [
    {
      id: 'add-product',
      label: 'Add product',
      path: '/products',
    },
    {
      id: 'receive-stock',
      label: 'Receive stock',
      path: '/products',
    },
    {
      id: 'remove-stock',
      label: 'Remove stock',
      path: '/products',
    },
  ];

  if (workspace.inventory.barcodeScanEnabled) {
    actions.push({
      id: 'scan-barcode',
      label: 'Scan barcode',
      path: '/products',
    });
  }

  if (workspace.import.mode === 'CSV') {
    actions.push({
      id: 'import-csv',
      label: 'Import CSV',
      path: '/products',
    });
  }

  return actions;
}

export function buildDashboardViewModel(
  overview: DashboardOverview,
  workspace: OnboardingState,
): DashboardViewModel {
  const workspaceName =
    workspace.organization.name.trim() ||
    workspace.branding.applicationName.trim() ||
    'your workspace';

  const isEmpty =
    overview.summary.totalProducts === 0;

  return {
    state: isEmpty ? 'empty' : 'ready',

    title: isEmpty
      ? `Welcome to ${workspaceName}`
      : 'Inventory overview',

    subtitle: isEmpty
      ? 'Your workspace is ready. Add your first product to begin tracking inventory.'
      : `Monitor inventory activity for ${workspaceName}.`,

    updatedLabel: `Updated ${formatDate(
      overview.updatedAt,
    )}`,

    summaryItems: buildSummaryItems(
      overview,
      workspace,
    ),

    attentionItems:
      workspace.inventory.lowStockEnabled
        ? overview.attentionItems.map(
            buildAttentionItem,
          )
        : [],

    recentActivity:
      overview.recentActivity.map(
        buildActivityItem,
      ),

    quickActions: buildQuickActions(workspace),
  };
}
