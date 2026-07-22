import type {
  ProductType,
} from '../../products/types/productCreation';

export type DashboardState = 'empty' | 'ready';

export type DashboardPeriod = '7d' | '30d' | '90d';

export interface DashboardPeriodOption {
  id: DashboardPeriod;
  label: string;
  days: number;
}

export type InventoryPulseStatus =
  | 'healthy'
  | 'stable'
  | 'at_risk';

export interface InventoryPulseFactorViewModel {
  id: string;
  label: string;
  score: number;
  maximum: number;
  explanation: string;
}

export interface InventoryPulseViewModel {
  score: number;
  status: InventoryPulseStatus;
  statusLabel: string;
  change: number | null;
  factors: InventoryPulseFactorViewModel[];
}

export type DashboardAttentionSeverity =
  | 'critical'
  | 'warning'
  | 'information';

export interface DashboardAttentionItem {
  id: string;
  productId: string;
  severity: DashboardAttentionSeverity;
  severityLabel: string;
  title: string;
  description: string;
  metadata: string[];
  actionLabel: string;
  actionTo: '/products';
}

export interface DashboardAttentionViewModel {
  total: number;
  affectedProductCount: number;
  items: DashboardAttentionItem[];
  hasMore: boolean;
}

export interface DashboardStockFlowSegment {
  id: 'active' | 'in_stock' | 'at_risk' | 'out_of_stock';
  label: string;
  value: string;
  helper: string;
  tone: 'neutral' | 'positive' | 'warning' | 'critical';
  route?: '/products';
}

export interface DashboardMovementPoint {
  date: string;
  label: string;
  received: number;
  consumed: number;
  adjusted: number;
}

export interface DashboardMovementViewModel {
  status: 'unavailable' | 'empty' | 'ready';
  points: DashboardMovementPoint[];
  textSummary: string;
}

export type DashboardRiskStatus =
  | 'healthy'
  | 'low_stock'
  | 'out_of_stock'
  | 'no_supplier';

export interface DashboardRiskCategory {
  id: DashboardRiskStatus;
  label: string;
  count: number;
  description: string;
  tone: 'positive' | 'warning' | 'critical' | 'neutral';
}

export interface DashboardRiskGroup {
  id: ProductType;
  label: string;
  counts: Record<DashboardRiskStatus, number>;
}

export interface DashboardRiskViewModel {
  totalProducts: number;
  categories: DashboardRiskCategory[];
  groups: DashboardRiskGroup[];
  textSummary: string;
  interpretation: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  description: string;
  tone: 'positive' | 'neutral' | 'warning';
}

export interface UpcomingDeliveryViewModel {
  id: string;
  reference: string;
  supplierName: string;
  expectedDate: string;
  quantitySummary: string;
  status: 'today' | 'upcoming' | 'late';
}

export interface DashboardDeliveriesViewModel {
  status: 'unavailable' | 'empty' | 'ready';
  items: UpcomingDeliveryViewModel[];
}

export type DashboardActivityType =
  | 'product_created'
  | 'supplier_linked'
  | 'customer_linked'
  | 'stock_received'
  | 'stock_consumed'
  | 'stock_adjusted'
  | 'low_stock'
  | 'purchase_order_received';

export interface DashboardActivityItem {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  occurredAt: string;
  occurredAtLabel: string;
  route?: '/products';
}

export interface DashboardPeriodData {
  movement: DashboardMovementViewModel;
  activities: DashboardActivityItem[];
}

export interface DashboardViewModel {
  state: DashboardState;
  header: {
    title: 'Inventory Control Center';
    eyebrow: string;
    summary: string;
    updatedLabel: string | null;
  };
  periods: DashboardPeriodOption[];
  pulse: InventoryPulseViewModel | null;
  attention: DashboardAttentionViewModel;
  stockFlow: DashboardStockFlowSegment[];
  risk: DashboardRiskViewModel;
  insights: DashboardInsight[];
  deliveries: DashboardDeliveriesViewModel;
  periodData: Record<DashboardPeriod, DashboardPeriodData>;
}
