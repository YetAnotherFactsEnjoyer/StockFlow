import type { ReactNode } from 'react';
import {
  FiPackage,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';
import type {
  ConfiguredCustomerAvailability,
  Product,
} from '../types/product';
import type {
  ProductType,
  StockUnit,
} from '../types/productCreation';

interface ProductListProps {
  products: Product[];
  searchActive: boolean;
  onAddProduct: () => void;
}

const productTypeLabels: Record<ProductType, string> = {
  finished_good: 'Finished good',
  raw_material: 'Raw material',
  component: 'Component',
  consumable: 'Consumable',
  packaging: 'Packaging',
  other: 'Other',
};

const stockUnitLabels: Record<StockUnit, string> = {
  unit: 'unit',
  kilogram: 'kg',
  gram: 'g',
  liter: 'L',
  meter: 'm',
  box: 'box',
  pallet: 'pallet',
  custom: 'custom',
};

const availabilityLabels: Record<
  ConfiguredCustomerAvailability,
  string
> = {
  internal: 'Internal',
  all_customers: 'All customers',
  selected_customers: 'Selected customers',
};

export function ProductList({
  products,
  searchActive,
  onAddProduct,
}: ProductListProps) {
  if (products.length === 0) {
    return searchActive ? (
      <ProductSearchEmptyState />
    ) : (
      <ProductCatalogEmptyState onAddProduct={onAddProduct} />
    );
  }

  return (
    <div className="min-w-full bg-surface">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-surface-secondary [&::-webkit-scrollbar-thumb]:bg-border-subtle">
        <table className="min-w-[900px] divide-y divide-border-subtle text-left">
          <thead>
            <tr>
              <TableHeading>Product</TableHeading>
              <TableHeading>SKU</TableHeading>
              <TableHeading>Type</TableHeading>
              <TableHeading>Stock</TableHeading>
              <TableHeading>Availability</TableHeading>
              <TableHeading>Status</TableHeading>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => (
              <ProductTableRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductTableRow({ product }: { product: Product }) {
  return (
    <tr className="transition-colors hover:bg-surface-secondary/50">
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-primary">
        <div>
          <p className="font-semibold">{product.name}</p>
          {product.description && (
            <p className="mt-0.5 max-w-xs truncate text-xs font-normal text-text-secondary">
              {product.description}
            </p>
          )}
        </div>
      </td>
      <TableCell>{product.sku ?? '—'}</TableCell>
      <TableCell>{productTypeLabels[product.type]}</TableCell>
      <TableCell>{formatStock(product)}</TableCell>
      <TableCell>
        {availabilityLabels[product.availability] ?? 'Internal'}
      </TableCell>
      <td className="whitespace-nowrap px-6 py-4 text-sm">
        <ProductStatus active={product.active} />
      </td>
    </tr>
  );
}

function ProductStatus({ active }: { active: boolean }) {
  return (
    <span
      className={[
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        active
          ? 'bg-success/10 text-success'
          : 'bg-surface-secondary text-text-secondary',
      ].join(' ')}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function TableHeading({ children }: { children: ReactNode }) {
  return (
    <th
      scope="col"
      className="whitespace-nowrap px-6 py-3 text-start text-xs font-medium uppercase tracking-wide text-text-secondary"
    >
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
      {children}
    </td>
  );
}

function ProductCatalogEmptyState({
  onAddProduct,
}: {
  onAddProduct: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border-subtle bg-surface px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand-default">
        <FiPackage aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-text-primary">
        No products yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
        Create your first product to start tracking stock, suppliers, and
        customer availability.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          leftIcon={<FiPlus className="size-4" />}
          onClick={onAddProduct}
        >
          Add product
        </Button>
      </div>
    </div>
  );
}

function ProductSearchEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border-subtle bg-surface px-6 py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-secondary text-text-secondary">
        <FiSearch aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-4 font-semibold text-text-primary">
        No matching products
      </h2>
      <p className="mt-2 text-sm text-text-secondary">
        Try searching with another name, SKU, or product type.
      </p>
    </div>
  );
}

function formatStock(product: Product) {
  const formattedQuantity = new Intl.NumberFormat().format(
    product.stockQuantity ?? 0,
  );
  const unit =
    product.stockUnit === 'custom'
      ? product.customStockUnit || stockUnitLabels.custom
      : stockUnitLabels[product.stockUnit];

  return `${formattedQuantity} ${unit}`;
}
