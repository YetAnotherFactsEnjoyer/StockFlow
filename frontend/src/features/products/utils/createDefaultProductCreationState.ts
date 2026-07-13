import type {
  ProductCreationDefaults,
  ProductCreationMode,
  ProductCreationState,
} from '../types/productCreation';

export function createDefaultProductCreationState(
  defaults: ProductCreationDefaults,
  mode: ProductCreationMode = 'quick',
): ProductCreationState {
  return {
    mode,
    currentStep: 'details',
    completedSteps: [],
    skippedSteps: [],

    draft: {
      details: {
        name: '',
        sku: '',
        description: '',
        type: '',
        stockUnit: '',
        customStockUnit: '',
      },

      inventory: {
        initialQuantity: '0',
        reorderLevel: defaults.lowStockEnabled
          ? String(
              defaults.defaultLowStockThreshold,
            )
          : '',
        barcode: '',
      },

      suppliers: [],

      commercial: {
        availability: 'unconfigured',
        defaultSellingPrice: '',
        customers: [],
      },
    },
  };
}
