import {
  createFileRoute,
  useRouter,
} from '@tanstack/react-router';
import { AnimatePresence } from 'motion/react';
import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  FiAlertTriangle,
  FiBox,
  FiCheck,
  FiCheckCircle,
  FiPackage,
  FiPlus,
  FiX,
} from 'react-icons/fi';

import {
  customerRepository,
} from '../../../features/customers/api';
import {
  useOnboarding,
} from '../../../features/onboarding/context/useOnboarding';
import {
  productRepository,
} from '../../../features/products/api';
import {
  AddProductChoice,
} from '../../../features/products/components/AddProductChoice';
import {
  DeleteProductDialog,
} from '../../../features/products/components/DeleteProductDialog';
import {
  ProductDetailsDialog,
} from '../../../features/products/components/ProductDetailsDialog';
import {
  ProductEditDialog,
} from '../../../features/products/components/ProductEditDialog';
import {
  ProductTable,
} from '../../../features/products/components/ProductTable';
import {
  ProductTableToolbar,
  type ProductAvailabilityFilter,
  type ProductSort,
  type ProductStatusFilter,
  type ProductTypeFilter,
} from '../../../features/products/components/ProductTableToolbar';
import {
  ProductTrendsDialog,
} from '../../../features/products/components/ProductTrendsDialog';
import {
  QuickCreateProduct,
} from '../../../features/products/components/QuickCreateProduct';
import type {
  Product,
} from '../../../features/products/types/product';
import {
  getProductStockState,
  productTypeLabels,
} from '../../../features/products/utils/productPresentation';
import {
  supplierRepository,
} from '../../../features/suppliers/api';
import {
  Button,
} from '../../../shared/components/Button';

interface ProductsSearch {
  quickCreate?: boolean;
}

type ProductDialogState = {
  type: 'details' | 'edit' | 'trends' | 'delete';
  productId: string;
} | null;

type Notice = {
  message: string;
  tone: 'success' | 'neutral';
} | null;

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
  loader: async () => {
    const [products, suppliers, customers] = await Promise.all([
      productRepository.list(),
      supplierRepository.listActive(),
      customerRepository.listActive(),
    ]);

    return { products, suppliers, customers };
  },
  component: ProductsPage,
});

function ProductsPage() {
  const { products, suppliers, customers } = Route.useLoaderData();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();
  const router = useRouter();
  const { state: workspace } = useOnboarding();

  const [creationChoiceOpen, setCreationChoiceOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(
    searchParams.quickCreate ?? false,
  );
  const [dialog, setDialog] = useState<ProductDialogState>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] =
    useState<ProductTypeFilter>('all');
  const [statusFilter, setStatusFilter] =
    useState<ProductStatusFilter>('all');
  const [availabilityFilter, setAvailabilityFilter] =
    useState<ProductAvailabilityFilter>('all');
  const [sort, setSort] = useState<ProductSort>('newest');

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    const nextProducts = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          product.name,
          product.sku ?? '',
          product.barcode ?? '',
          product.type,
          productTypeLabels[product.type],
        ].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        );
      const matchesType =
        typeFilter === 'all' || product.type === typeFilter;
      const stockState = getProductStockState(product);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && product.active) ||
        (statusFilter === 'inactive' && !product.active) ||
        statusFilter === stockState;
      const matchesAvailability =
        availabilityFilter === 'all' ||
        product.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesAvailability
      );
    });

    return nextProducts.sort((firstProduct, secondProduct) => {
      switch (sort) {
        case 'oldest':
          return getTimestamp(firstProduct.updatedAt) -
            getTimestamp(secondProduct.updatedAt);
        case 'name_asc':
          return firstProduct.name.localeCompare(secondProduct.name);
        case 'name_desc':
          return secondProduct.name.localeCompare(firstProduct.name);
        case 'stock_asc':
          return firstProduct.stockQuantity - secondProduct.stockQuantity;
        case 'stock_desc':
          return secondProduct.stockQuantity - firstProduct.stockQuantity;
        case 'newest':
        default:
          return getTimestamp(secondProduct.updatedAt) -
            getTimestamp(firstProduct.updatedAt);
      }
    });
  }, [
    availabilityFilter,
    normalizedSearch,
    products,
    sort,
    statusFilter,
    typeFilter,
  ]);

  const activeProduct = dialog
    ? products.find((product) => product.id === dialog.productId)
    : undefined;
  const lowStockCount = products.filter(
    (product) => getProductStockState(product) === 'low_stock',
  ).length;
  const outOfStockCount = products.filter(
    (product) => getProductStockState(product) === 'out_of_stock',
  ).length;
  const hasActiveFilters =
    normalizedSearch.length > 0 ||
    typeFilter !== 'all' ||
    statusFilter !== 'all' ||
    availabilityFilter !== 'all' ||
    sort !== 'newest';

  function getTimestamp(value: string) {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function openDialog(
    type: NonNullable<ProductDialogState>['type'],
    productId: string,
  ) {
    setCreationChoiceOpen(false);
    setQuickCreateOpen(false);
    setDialog({ type, productId });
  }

  function openCreationChoice() {
    setDialog(null);
    setQuickCreateOpen(false);
    setCreationChoiceOpen(true);
  }

  function closeQuickCreate() {
    setQuickCreateOpen(false);

    if (searchParams.quickCreate) {
      void navigate({ replace: true, search: {} });
    }
  }

  function handleProductCreated(product: Product) {
    setNotice({
      tone: 'success',
      message: `${product.name} was created successfully.`,
    });
    void router.invalidate();
  }

  function handleProductUpdated(product: Product) {
    setDialog(null);
    setNotice({
      tone: 'success',
      message: `${product.name} was updated successfully.`,
    });
    void router.invalidate();
  }

  function handleProductDeleted(product: Product) {
    setDialog(null);
    setNotice({
      tone: 'neutral',
      message: `${product.name} was deleted.`,
    });
    void router.invalidate();
  }

  function clearFilters() {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setAvailabilityFilter('all');
    setSort('newest');
  }

  return (
    <section className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-default">Inventory catalogue</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Search, review, and maintain every stocked item from one operational workspace.
          </p>
        </div>
        <Button
          className="shrink-0 px-5"
          leftIcon={<FiPlus className="size-4" />}
          onClick={openCreationChoice}
        >
          Add product
        </Button>
      </header>

      {notice && (
        <div
          role="status"
          className={[
            'mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
            notice.tone === 'success'
              ? 'border-success/25 bg-success/10 text-success'
              : 'border-border-subtle bg-surface text-text-primary',
          ].join(' ')}
        >
          <FiCheck aria-hidden="true" className="size-4 shrink-0" />
          <p className="flex-1">{notice.message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setNotice(null)}
            className="grid size-8 place-items-center rounded-lg transition hover:bg-black/5"
          >
            <FiX aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<FiPackage />}
          label="Total products"
          value={products.length}
          detail="All catalogue records"
        />
        <SummaryCard
          icon={<FiCheckCircle />}
          label="Active"
          value={products.filter((product) => product.active).length}
          detail="Available for operations"
          tone="success"
        />
        <SummaryCard
          icon={<FiAlertTriangle />}
          label="Low stock"
          value={lowStockCount}
          detail="At or below reorder level"
          tone="warning"
        />
        <SummaryCard
          icon={<FiBox />}
          label="Out of stock"
          value={outOfStockCount}
          detail="No quantity available"
          tone="danger"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-sm">
        <ProductTableToolbar
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          availabilityFilter={availabilityFilter}
          sort={sort}
          resultCount={filteredProducts.length}
          totalCount={products.length}
          hasActiveFilters={hasActiveFilters}
          onSearchQueryChange={setSearchQuery}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
          onAvailabilityFilterChange={setAvailabilityFilter}
          onSortChange={setSort}
          onClear={clearFilters}
        />
        <ProductTable
          products={filteredProducts}
          emptyReason={products.length === 0 ? 'catalog' : 'filtered'}
          onAddProduct={openCreationChoice}
          onView={(productId) => openDialog('details', productId)}
          onEdit={(productId) => openDialog('edit', productId)}
          onTrends={(productId) => openDialog('trends', productId)}
          onDelete={(productId) => openDialog('delete', productId)}
        />
      </div>

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

      <AnimatePresence mode="wait">
        {dialog && activeProduct && dialog.type === 'details' && (
          <ProductDetailsDialog
            key={`details-${activeProduct.id}`}
            product={activeProduct}
            suppliers={suppliers}
            customers={customers}
            currency={workspace.organization.currency}
            onClose={() => setDialog(null)}
            onEdit={() => openDialog('edit', activeProduct.id)}
            onTrends={() => openDialog('trends', activeProduct.id)}
            onDelete={() => openDialog('delete', activeProduct.id)}
          />
        )}

        {dialog && activeProduct && dialog.type === 'edit' && (
          <ProductEditDialog
            key={`edit-${activeProduct.id}`}
            product={activeProduct}
            suppliers={suppliers}
            customers={customers}
            repository={productRepository}
            onClose={() => setDialog(null)}
            onUpdated={handleProductUpdated}
          />
        )}

        {dialog && activeProduct && dialog.type === 'trends' && (
          <ProductTrendsDialog
            key={`trends-${activeProduct.id}`}
            product={activeProduct}
            currency={workspace.organization.currency}
            onClose={() => setDialog(null)}
          />
        )}

        {dialog && activeProduct && dialog.type === 'delete' && (
          <DeleteProductDialog
            key={`delete-${activeProduct.id}`}
            product={activeProduct}
            repository={productRepository}
            onClose={() => setDialog(null)}
            onDeleted={handleProductDeleted}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  tone = 'brand',
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  tone?: 'brand' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    brand: 'bg-brand-soft text-brand-default',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <article className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">
            {value.toLocaleString()}
          </p>
        </div>
        <span className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs text-text-secondary">{detail}</p>
    </article>
  );
}
