export interface DashboardSummary {
  totalProducts: number;
  totalUnits: number;
  lowStockProducts: number;
  inventoryValue: number | null;
  activeSuppliers: number;
}

export type DashboardAttentionStatus =
  | 'low_stock'
  | 'out_of_stock';

export interface DashboardAttentionItem {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
  status: DashboardAttentionStatus;
}

export type DashboardActivityType =
  | 'stock_in'
  | 'stock_out'
  | 'adjustment';

export interface DashboardActivityItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: DashboardActivityType;
  quantity: number;
  performedBy: string | null;
  createdAt: string;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  attentionItems: DashboardAttentionItem[];
  recentActivity: DashboardActivityItem[];
  updatedAt: string;
}
