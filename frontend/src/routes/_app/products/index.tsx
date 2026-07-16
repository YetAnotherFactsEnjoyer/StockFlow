import {
  createFileRoute,
  useRouter,
} from '@tanstack/react-router';
import {
  useMemo,
  useState,
} from 'react';
import {
  FiCheck,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';

import {
  productRepository,
} from '../../../features/products/api';
import {
  AddProductChoice,
} from '../../../features/products/components/AddProductChoice';
import {
  ProductList,
} from '../../../features/products/components/ProductList';
import {
  QuickCreateProduct,
} from '../../../features/products/components/QuickCreateProduct';
import type {
  Product,
} from '../../../features/products/types/product';
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
  loader: () => productRepository.list(),
  component: ProductsPage,
});

function ProductsPage() {
  const products = Route.useLoaderData();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();

  const [
    creationChoiceOpen,
    setCreationChoiceOpen,
  ] = useState(false);
  const [
    quickCreateOpen,
    setQuickCreateOpen,
  ] = useState(searchParams.quickCreate ?? false);
  const [search, setSearch] = useState('');
  const [createdProduct, setCreatedProduct] =
    useState<Product | null>(null);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.sku ?? '',
        product.type,
      ].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [products, normalizedSearch]);

  function closeQuickCreate() {
    setQuickCreateOpen(false);

    if (searchParams.quickCreate) {
      void navigate({
        replace: true,
        search: {},
      });
    }
  }

  function handleProductCreated(product: Product) {
    setCreatedProduct(product);
    void router.invalidate();
  }

  return (
    <section className="m-10 bg-app-bg p-8">
      {createdProduct && (
        <div
          role="status"
          className="mb-5 flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success"
        >
          <FiCheck aria-hidden="true" className="size-4 shrink-0" />
          <p>
            <span className="font-semibold">{createdProduct.name}</span>{' '}
            was created successfully.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-6 flex items-center justify-between gap-6">
          <div className="flex w-full max-w-sm min-w-0 items-center border-b-2 border-border-subtle bg-transparent px-1 focus-within:border-brand-default">
            <FiSearch
              aria-hidden="true"
              className="size-4 shrink-0 text-text-secondary"
            />
            <input
              type="search"
              value={search}
              placeholder="Search by name, SKU, or type"
              aria-label="Search products"
              onChange={(event) => setSearch(event.currentTarget.value)}
              className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm text-text-primary outline-none placeholder:text-text-secondary"
            />
          </div>

          <Button
            className="shrink-0 px-6 py-2.5"
            leftIcon={<FiPlus className="size-4" />}
            onClick={() => setCreationChoiceOpen(true)}
          >
            Add product
          </Button>
        </div>
      )}

      <ProductList
        products={filteredProducts}
        searchActive={normalizedSearch.length > 0}
        onAddProduct={() => setCreationChoiceOpen(true)}
      />

      <AddProductChoice
        open={creationChoiceOpen}
        onClose={() => setCreationChoiceOpen(false)}
        onQuickCreate={() => {
          setCreationChoiceOpen(false);
          setQuickCreateOpen(true);
        }}
      />

      <QuickCreateProduct
        open={quickCreateOpen}
        onClose={closeQuickCreate}
        onCreated={handleProductCreated}
      />
    </section>
  );
}
