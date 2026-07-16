export const PRODUCT_CREATION_STEPS = [
  'details',
  'inventory',
  'suppliers',
  'customers',
  'review',
] as const;

export type ProductCreationStep =
  (typeof PRODUCT_CREATION_STEPS)[number];

export type ProductCreationOptionalStep = Exclude<
  ProductCreationStep,
  'details' | 'review'
>;

export type ProductCreationMode =
  | 'quick'
  | 'full';

export type ProductType =
  | 'finished_good'
  | 'raw_material'
  | 'component'
  | 'consumable'
  | 'packaging'
  | 'other';

export type StockUnit =
  | 'unit'
  | 'kilogram'
  | 'gram'
  | 'liter'
  | 'meter'
  | 'box'
  | 'pallet'
  | 'custom';

export interface ProductDetailsDraft {
  name: string;
  sku: string;
  description: string;
  type: ProductType | '';
  stockUnit: StockUnit | '';
  customStockUnit: string;
}

export interface ProductInventoryDraft {
  initialQuantity: string;
  reorderLevel: string;
  barcode: string;
}

export interface ProductSupplierDraft {
  temporaryId: string;
  supplierId: string;
  supplierSku: string;
  purchasePrice: string;
  minimumOrderQuantity: string;
  leadTimeDays: string;
  preferred: boolean;
}

export type CustomerAvailability =
  | 'unconfigured'
  | 'internal'
  | 'all_customers'
  | 'selected_customers';

export interface ProductCustomerDraft {
  temporaryId: string;
  customerId: string;
  customerSku: string;
  sellingPrice: string;
  minimumOrderQuantity: string;
}

export interface ProductCommercialDraft {
  availability: CustomerAvailability;
  defaultSellingPrice: string;
  customers: ProductCustomerDraft[];
}

export interface ProductCreationDraft {
  details: ProductDetailsDraft;
  inventory: ProductInventoryDraft;
  suppliers: ProductSupplierDraft[];
  commercial: ProductCommercialDraft;
}

export interface ProductCreationState {
  mode: ProductCreationMode;
  currentStep: ProductCreationStep;
  completedSteps: ProductCreationStep[];
  skippedSteps: ProductCreationOptionalStep[];
  draft: ProductCreationDraft;
}

export interface ProductCreationDefaults {
  skuRequired: boolean;
  lowStockEnabled: boolean;
  defaultLowStockThreshold: number;
  barcodeScanEnabled: boolean;
}
