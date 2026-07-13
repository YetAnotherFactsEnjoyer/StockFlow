import {
  useContext,
} from 'react';

import {
  ProductCreationContext,
} from './ProductCreationContext';

export function useProductCreation() {
  const context = useContext(
    ProductCreationContext,
  );

  if (!context) {
    throw new Error(
      'useProductCreation must be used within a ProductCreationProvider',
    );
  }

  return context;
}
