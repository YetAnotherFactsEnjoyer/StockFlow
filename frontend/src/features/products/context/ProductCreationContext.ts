import {
  createContext,
  type Dispatch,
} from 'react';

import type {
  ProductCommercialDraft,
  ProductCreationDefaults,
  ProductCreationMode,
  ProductCreationOptionalStep,
  ProductCreationState,
  ProductCreationStep,
  ProductCustomerDraft,
  ProductDetailsDraft,
  ProductInventoryDraft,
  ProductSupplierDraft,
} from '../types/productCreation';

export type ProductCreationAction =
  | {
    type: 'HYDRATE';
    payload: ProductCreationState;
  }
  | {
    type: 'SET_MODE';
    payload: ProductCreationMode;
  }
  | {
    type: 'SET_CURRENT_STEP';
    payload: ProductCreationStep;
  }
  | {
    type: 'UPDATE_DETAILS';
    payload: Partial<ProductDetailsDraft>;
  }
  | {
    type: 'UPDATE_INVENTORY';
    payload: Partial<ProductInventoryDraft>;
  }
  | {
    type: 'SET_SUPPLIERS';
    payload: ProductSupplierDraft[];
  }
  | {
    type: 'UPDATE_COMMERCIAL';
    payload: Partial<
      Pick<
        ProductCommercialDraft,
        | 'availability'
        | 'defaultSellingPrice'
      >
    >;
  }
  | {
    type: 'SET_CUSTOMERS';
    payload: ProductCustomerDraft[];
  }
  | {
    type: 'MARK_STEP_COMPLETE';
    payload: ProductCreationStep;
  }
  | {
    type: 'SKIP_STEP';
    payload: ProductCreationOptionalStep;
  }
  | {
    type: 'RESET';
    payload: ProductCreationDefaults;
  };

export interface ProductCreationContextValue {
  state: ProductCreationState;
  defaults: ProductCreationDefaults;
  dispatch: Dispatch<ProductCreationAction>;
}

export const ProductCreationContext =
  createContext<ProductCreationContextValue | null>(
    null,
  );
