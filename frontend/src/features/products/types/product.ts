import type {
  CustomerAvailability,
  ProductType,
  StockUnit,
} from './productCreation';

export type ConfiguredCustomerAvailability =
  Exclude<
    CustomerAvailability,
    'unconfigured'
  >;

export interface Product {
  id: string;

  name: string;
  sku: string | null;
  description: string | null;

  type: ProductType;
  stockUnit: StockUnit;
  customStockUnit: string | null;

  stockQuantity: number;
  reorderLevel: number | null;
  barcode: string | null;

  availability:
  ConfiguredCustomerAvailability;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  sku: string | null;
  description: string | null;

  type: ProductType;
  stockUnit: StockUnit;
  customStockUnit: string | null;

  initialQuantity: number;
  reorderLevel: number | null;
  barcode: string | null;

  availability:
  ConfiguredCustomerAvailability;
}
