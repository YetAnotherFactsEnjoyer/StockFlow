import type {
  ConfiguredCustomerAvailability,
} from '../../products/types/product';
import type {
  ProductType,
  StockUnit,
} from '../../products/types/productCreation';

export interface DashboardProductSnapshot {
  id: string;
  name: string;
  sku: string | null;
  type: ProductType;
  stockUnit: StockUnit;
  customStockUnit: string | null;
  stockQuantity: number;
  reorderLevel: number | null;
  availability: ConfiguredCustomerAvailability;
  supplierIds: string[];
  customerIds: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DashboardMovementType =
  | 'received'
  | 'consumed'
  | 'adjusted';

export interface DashboardMovementRaw {
  id: string;
  productId: string;
  productName: string;
  type: DashboardMovementType;
  quantity: number;
  occurredAt: string;
}

export interface UpcomingDeliveryRaw {
  id: string;
  reference: string;
  supplierName: string;
  expectedDate: string;
  quantitySummary: string;
  status: 'today' | 'upcoming' | 'late';
}

export type DashboardFeed<T> =
  | {
      status: 'available';
      items: T[];
    }
  | {
      status: 'unavailable';
    };

export interface DashboardOverview {
  capturedAt: string;
  updatedAt: string | null;
  products: DashboardProductSnapshot[];
  activeSupplierIds: string[];
  activeCustomerIds: string[];
  movements: DashboardFeed<DashboardMovementRaw>;
  upcomingDeliveries: DashboardFeed<UpcomingDeliveryRaw>;
}
