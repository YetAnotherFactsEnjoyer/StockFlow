export type DashboardState =
  | 'empty'
  | 'ready';

export interface DashboardSummaryItem {
  id:
    | 'products'
    | 'low-stock'
    | 'inventory-value'
    | 'total-units'
    | 'suppliers';
  label: string;
  value: string;
  emphasis: 'default' | 'warning';
}

export interface DashboardAttentionItemView {
  productId: string;
  productName: string;
  sku: string;
  stockLabel: string;
  thresholdLabel: string;
  statusLabel: string;
  severity: 'warning' | 'critical';
}

export interface DashboardActivityItemView {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  actionLabel: string;
  quantityLabel: string;
  performedByLabel: string | null;
  dateLabel: string;
  direction: 'positive' | 'negative' | 'neutral';
}

export type DashboardQuickActionId =
  | 'add-product'
  | 'receive-stock'
  | 'remove-stock'
  | 'scan-barcode'
  | 'import-csv';

export interface DashboardQuickAction {
  id: DashboardQuickActionId;
  label: string;
  path: '/products';
}

export interface DashboardViewModel {
  state: DashboardState;
  title: string;
  subtitle: string;
  updatedLabel: string;
  summaryItems: DashboardSummaryItem[];
  attentionItems: DashboardAttentionItemView[];
  recentActivity: DashboardActivityItemView[];
  quickActions: DashboardQuickAction[];
}
