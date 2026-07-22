import {
  useId,
  type ReactNode,
} from 'react';
import {
  FiBarChart2,
  FiEdit2,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

import type {
  Customer,
} from '../../customers/types/customer';
import type {
  Supplier,
} from '../../suppliers/types/supplier';
import {
  Button,
} from '../../../shared/components/Button';
import type {
  Product,
} from '../types/product';
import {
  availabilityLabels,
  formatProductDate,
  formatProductMoney,
  getStockUnitLabel,
  productTypeLabels,
} from '../utils/productPresentation';
import {
  ProductDialogFrame,
} from './ProductDialogFrame';
import {
  ProductStatusBadge,
} from './ProductStatusBadge';
import {
  ProductStockStatus,
} from './ProductStockStatus';

interface ProductDetailsDialogProps {
  product: Product;
  suppliers: Supplier[];
  customers: Customer[];
  currency: string;
  onClose: () => void;
  onEdit: () => void;
  onTrends: () => void;
  onDelete: () => void;
}

export function ProductDetailsDialog({
  product,
  suppliers,
  customers,
  currency,
  onClose,
  onEdit,
  onTrends,
  onDelete,
}: ProductDetailsDialogProps) {
  const titleId = useId();
  const linkedSuppliers = product.suppliers ?? [];
  const linkedCustomers = product.customers ?? [];

  return (
    <ProductDialogFrame
      titleId={titleId}
      layout="drawer"
      onClose={onClose}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border-subtle px-6 py-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id={titleId}
              className="truncate text-xl font-semibold text-text-primary"
            >
              {product.name}
            </h2>
            <ProductStatusBadge active={product.active} />
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {product.sku || 'No internal SKU'}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="grid size-10 shrink-0 place-items-center rounded-xl text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
        >
          <FiX aria-hidden="true" className="size-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <section className="rounded-2xl border border-border-subtle bg-surface-secondary/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Current inventory
          </p>
          <div className="mt-3">
            <ProductStockStatus
              stockQuantity={product.stockQuantity}
              reorderLevel={product.reorderLevel}
              stockUnit={product.stockUnit}
              customStockUnit={product.customStockUnit}
            />
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Reorder level:{' '}
            {product.reorderLevel === null
              ? 'Not configured'
              : `${product.reorderLevel.toLocaleString()} ${getStockUnitLabel(product.stockUnit, product.customStockUnit)}`}
          </p>
        </section>

        <DetailSection title="Product details">
          <DetailField label="Type" value={productTypeLabels[product.type]} />
          <DetailField
            label="Stock unit"
            value={getStockUnitLabel(
              product.stockUnit,
              product.customStockUnit,
            )}
          />
          <DetailField label="Barcode" value={product.barcode || 'Not set'} />
          <DetailField
            label="Availability"
            value={availabilityLabels[product.availability]}
          />
          <DetailField
            label="Default selling price"
            value={formatProductMoney(
              product.defaultSellingPrice,
              currency,
            )}
          />
          <DetailField
            label="Last updated"
            value={formatProductDate(product.updatedAt)}
          />
        </DetailSection>

        <DetailSection title="Description">
          <p className="col-span-full text-sm leading-6 text-text-secondary">
            {product.description || 'No description has been added.'}
          </p>
        </DetailSection>

        <DetailSection title={`Suppliers (${linkedSuppliers.length})`}>
          {linkedSuppliers.length === 0 ? (
            <EmptyRelation text="No suppliers are linked to this product." />
          ) : (
            linkedSuppliers.map((link) => {
              const supplier = suppliers.find(
                (item) => item.id === link.supplierId,
              );

              return (
                <div
                  key={link.id}
                  className="col-span-full flex items-center justify-between gap-4 rounded-xl border border-border-subtle px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {supplier?.name || link.supplierId}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {link.supplierSku || 'No supplier SKU'}
                    </p>
                  </div>
                  {link.preferred && (
                    <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-default">
                      Preferred
                    </span>
                  )}
                </div>
              );
            })
          )}
        </DetailSection>

        {product.availability === 'selected_customers' && (
          <DetailSection title={`Customers (${linkedCustomers.length})`}>
            {linkedCustomers.length === 0 ? (
              <EmptyRelation text="No customers are linked to this product." />
            ) : (
              linkedCustomers.map((link) => {
                const customer = customers.find(
                  (item) => item.id === link.customerId,
                );

                return (
                  <div
                    key={link.id}
                    className="col-span-full rounded-xl border border-border-subtle px-4 py-3"
                  >
                    <p className="truncate text-sm font-medium text-text-primary">
                      {customer?.name || link.customerId}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {link.customerSku || 'No customer SKU'}
                    </p>
                  </div>
                );
              })
            )}
          </DetailSection>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-6 py-4">
        <Button
          variant="ghost"
          className="text-danger hover:bg-danger/10 hover:text-danger"
          leftIcon={<FiTrash2 className="size-4" />}
          onClick={onDelete}
        >
          Delete
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<FiBarChart2 className="size-4" />}
            onClick={onTrends}
          >
            Trends
          </Button>
          <Button
            leftIcon={<FiEdit2 className="size-4" />}
            onClick={onEdit}
          >
            Modify
          </Button>
        </div>
      </footer>
    </ProductDialogFrame>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </section>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-text-primary">{value}</dd>
    </div>
  );
}

function EmptyRelation({ text }: { text: string }) {
  return (
    <p className="col-span-full rounded-xl border border-dashed border-border-subtle px-4 py-5 text-center text-sm text-text-secondary">
      {text}
    </p>
  );
}
