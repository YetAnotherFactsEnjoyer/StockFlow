import {
  createFileRoute,
  Outlet,
} from '@tanstack/react-router';

import { useOnboarding } from '../../../features/onboarding/context/useOnboarding';
import { ProductCreationProvider } from '../../../features/products/context/ProductCreationProvider';
import type { ProductCreationDefaults } from '../../../features/products/types/productCreation';

export const Route = createFileRoute(
  '/_app/products',
)({
  component: ProductsRoute,
});

function ProductsRoute() {
  const { state } = useOnboarding();

  const creationDefaults: ProductCreationDefaults = {
    skuRequired:
      state.inventory.skuRequired,

    lowStockEnabled:
      state.inventory.lowStockEnabled,

    defaultLowStockThreshold:
      state.inventory.defaultLowStockThreshold,
  };

  return (
    <ProductCreationProvider
      defaults={creationDefaults}
    >
      <Outlet />
    </ProductCreationProvider>
  );
}
