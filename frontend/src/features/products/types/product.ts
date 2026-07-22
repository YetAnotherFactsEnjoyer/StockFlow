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

export interface ProductSupplier {
  id: string;
  supplierId: string;
  supplierSku: string | null;
  purchasePrice: number | null;
  minimumOrderQuantity: number | null;
  leadTimeDays: number | null;
  preferred: boolean;
}

export interface ProductCustomer {
  id: string;
  customerId: string;
  customerSku: string | null;
  sellingPrice: number | null;
  minimumOrderQuantity: number | null;
}

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
  availability: ConfiguredCustomerAvailability;
  defaultSellingPrice: number | null;
  suppliers: ProductSupplier[];
  customers: ProductCustomer[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDetailsRequest {
  name: string;
  sku: string | null;
  description: string | null;
  type: ProductType;
  stockUnit: StockUnit;
  customStockUnit: string | null;
}

export interface CreateProductInventoryRequest {
  initialQuantity: number;
  reorderLevel: number | null;
  barcode: string | null;
}

export interface CreateProductSupplierRequest {
  supplierId: string;
  supplierSku: string | null;
  purchasePrice: number | null;
  minimumOrderQuantity: number | null;
  leadTimeDays: number | null;
  preferred: boolean;
}

export interface CreateProductCustomerRequest {
  customerId: string;
  customerSku: string | null;
  sellingPrice: number | null;
  minimumOrderQuantity: number | null;
}

export interface CreateProductCommercialRequest {
  availability: ConfiguredCustomerAvailability;
  defaultSellingPrice: number | null;
  customers: CreateProductCustomerRequest[];
}

export interface CreateProductRequest {
  details: CreateProductDetailsRequest;
  inventory?: CreateProductInventoryRequest;
  suppliers?: CreateProductSupplierRequest[];
  commercial?: CreateProductCommercialRequest;
}

export interface UpdateProductRequest
  extends CreateProductRequest {
  active: boolean;
}
