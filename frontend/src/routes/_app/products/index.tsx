import { createFileRoute } from '@tanstack/react-router';
import {
  useState,
} from 'react';
import {
  FiPlus,
} from 'react-icons/fi';

import {
  QuickCreateProduct,
} from '../../../features/products/components/QuickCreateProduct';
import {
  Button,
} from '../../../shared/components/Button';


interface ProductsSearch {
  quickCreate?: boolean;
}

export const Route = createFileRoute('/_app/products/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): ProductsSearch => ({
    quickCreate:
      search.quickCreate === true ||
      search.quickCreate === 'true'
        ? true
        : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [
    quickCreateOpen,
    setQuickCreateOpen,
  ] = useState(
    search.quickCreate ?? false,
  );

  function closeQuickCreate() {
    setQuickCreateOpen(false);

    if (search.quickCreate) {
      void navigate({
        replace: true,
        search: {},
      });
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Inventory</p>
          <h1>Products</h1>
        </div>
        <Button
          leftIcon={
            <FiPlus className="size-4" />
          }
          onClick={() =>
            setQuickCreateOpen(true)
          }
        >
          Add product
        </Button>
      </header>

      <QuickCreateProduct
        open={quickCreateOpen}
        onClose={closeQuickCreate}
      />
    </section>
  );
}
