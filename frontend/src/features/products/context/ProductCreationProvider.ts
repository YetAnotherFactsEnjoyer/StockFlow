import {
  createElement,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import type {
  ProductCommercialDraft,
  ProductCreationDefaults,
  ProductCreationState,
  ProductDetailsDraft,
  ProductInventoryDraft,
  ProductSupplierDraft,
} from '../types/productCreation';
import {
  createDefaultProductCreationState,
} from '../utils/createDefaultProductCreationState';
import {
  ProductCreationContext,
} from './ProductCreationContext';
import {
  productCreationReducer,
} from './productCreationReducer';

const STORAGE_KEY =
  'stockflow.product-creation';

type StoredProductCreationState = Partial<
  Omit<ProductCreationState, 'draft'>
> & {
  draft?: {
    details?: Partial<ProductDetailsDraft>;
    inventory?: Partial<ProductInventoryDraft>;
    suppliers?: ProductSupplierDraft[];
    commercial?: Partial<ProductCommercialDraft>;
  };
};

function createInitialState(
  defaults: ProductCreationDefaults,
): ProductCreationState {
  const defaultState =
    createDefaultProductCreationState(
      defaults,
    );

  if (typeof window === 'undefined') {
    return defaultState;
  }

  const storedValue =
    window.sessionStorage.getItem(
      STORAGE_KEY,
    );

  if (!storedValue) {
    return defaultState;
  }

  try {
    const storedState = JSON.parse(
      storedValue,
    ) as StoredProductCreationState;

    return {
      ...defaultState,
      ...storedState,

      completedSteps:
        storedState.completedSteps ??
        defaultState.completedSteps,

      skippedSteps:
        storedState.skippedSteps ??
        defaultState.skippedSteps,

      draft: {
        ...defaultState.draft,
        ...storedState.draft,

        details: {
          ...defaultState.draft.details,
          ...storedState.draft?.details,
        },

        inventory: {
          ...defaultState.draft.inventory,
          ...storedState.draft?.inventory,
        },

        suppliers:
          storedState.draft?.suppliers ??
          defaultState.draft.suppliers,

        commercial: {
          ...defaultState.draft.commercial,
          ...storedState.draft?.commercial,

          customers:
            storedState.draft?.commercial
              ?.customers ??
            defaultState.draft.commercial
              .customers,
        },
      },
    };
  } catch {
    window.sessionStorage.removeItem(
      STORAGE_KEY,
    );

    return defaultState;
  }
}

interface ProductCreationProviderProps {
  children: ReactNode;
  defaults: ProductCreationDefaults;
}

export function ProductCreationProvider({
  children,
  defaults,
}: ProductCreationProviderProps) {
  const [state, dispatch] = useReducer(
    productCreationReducer,
    defaults,
    createInitialState,
  );

  useEffect(() => {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      defaults,
      dispatch,
    }),
    [state, defaults],
  );

  return createElement(
    ProductCreationContext.Provider,
    { value },
    children,
  );
}
