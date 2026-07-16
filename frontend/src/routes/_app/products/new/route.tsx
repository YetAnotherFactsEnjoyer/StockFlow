import {
  createFileRoute,
  Outlet,
} from '@tanstack/react-router';
import { useEffect } from 'react';

import {
  ProductCreationShell,
} from '../../../../features/products/components/creation/ProductCreationShell';
import {
  useProductCreation,
} from '../../../../features/products/context/useProductCreation';

export const Route = createFileRoute(
  '/_app/products/new',
)({
  component: FullProductCreationRoute,
});

function FullProductCreationRoute() {
  const { dispatch } =
    useProductCreation();

  useEffect(() => {
    dispatch({
      type: 'SET_MODE',
      payload: 'full',
    });
  }, [dispatch]);

  return (
    <ProductCreationShell>
      <Outlet />
    </ProductCreationShell>
  );
}
