import type {
  Product,
} from '../types/product';
import {
  availabilityLabels,
  formatProductDate,
  getStockUnitLabel,
  productTypeLabels,
} from '../utils/productPresentation';
import {
  ProductStatusBadge,
} from './ProductStatusBadge';
import {
  ProductStockStatus,
} from './ProductStockStatus';

interface ProductTableRowProps {
  product: Product;
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onTrends: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductTableRow({
  product,
  onView,
  onEdit,
  onTrends,
  onDelete,
}: ProductTableRowProps) {
  const suppliers = product.suppliers ?? [];
  const preferredSupplier = suppliers.find(
    (supplier) => supplier.preferred,
  );

  return (
    <tr
      tabIndex={0}
      className="group cursor-pointer border-b border-border-subtle outline-none transition last:border-b-0 hover:bg-surface-secondary/70 focus-visible:bg-brand-soft"
      onClick={() => onView(product.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onView(product.id);
        }
      }}
    >
      <td className="sticky left-0 z-10 min-w-64 bg-surface px-5 py-4 transition group-hover:bg-surface-secondary group-focus-visible:bg-brand-soft">
        <div className="max-w-xs">
          <p className="truncate text-sm font-semibold text-text-primary">
            {product.name}
          </p>
          <p className="mt-1 truncate text-xs text-text-secondary">
            {product.description || 'No description'}
          </p>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-text-primary">
        {product.sku || '—'}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">
        {productTypeLabels[product.type]}
      </td>
      <td className="px-4 py-4">
        <ProductStockStatus
          stockQuantity={product.stockQuantity}
          reorderLevel={product.reorderLevel}
          stockUnit={product.stockUnit}
          customStockUnit={product.customStockUnit}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">
        {product.reorderLevel === null
          ? 'Not set'
          : `${product.reorderLevel.toLocaleString()} ${getStockUnitLabel(product.stockUnit, product.customStockUnit)}`}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">
        {availabilityLabels[product.availability]}
      </td>
      <td className="min-w-40 px-4 py-4">
        <p className="truncate text-sm text-text-primary">
          {suppliers.length === 0
            ? 'No suppliers'
            : preferredSupplier?.supplierId ??
              suppliers[0]?.supplierId}
        </p>
        {suppliers.length > 1 && (
          <p className="mt-1 text-xs text-text-secondary">
            +{suppliers.length - 1} more
          </p>
        )}
      </td>
      <td className="px-4 py-4">
        <ProductStatusBadge active={product.active} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-secondary">
        {formatProductDate(product.updatedAt)}
      </td>
      <td className="sticky right-0 z-10 bg-surface px-4 py-4 text-right transition group-hover:bg-surface-secondary group-focus-visible:bg-brand-soft">
        <div
          className="flex items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          <ActionButton
            label="View"
            accessibleLabel={`View ${product.name}`}
            emphasis
            onClick={() => onView(product.id)}
          />
          <ActionButton
            label="Modify"
            accessibleLabel={`Modify ${product.name}`}
            onClick={() => onEdit(product.id)}
          />
          <ActionButton
            label="Trends"
            accessibleLabel={`View trends for ${product.name}`}
            onClick={() => onTrends(product.id)}
          />
          <ActionButton
            label="Delete"
            accessibleLabel={`Delete ${product.name}`}
            danger
            onClick={() => onDelete(product.id)}
          />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  label,
  accessibleLabel,
  emphasis = false,
  danger = false,
  onClick,
}: {
  label: string;
  accessibleLabel: string;
  emphasis?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      onClick={onClick}
      className={[
        'rounded-lg px-2.5 py-2 text-sm font-medium transition',
        danger
          ? 'text-danger hover:bg-danger/10'
          : emphasis
            ? 'text-brand-default hover:bg-brand-soft'
            : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
