import {
  FiBox,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';
import type {
  Product,
} from '../types/product';
import {
  ProductTableRow,
} from './ProductTableRow';

interface ProductTableProps {
  products: Product[];
  emptyReason: 'catalog' | 'filtered';
  onAddProduct: () => void;
  onView: (productId: string) => void;
  onEdit: (productId: string) => void;
  onTrends: (productId: string) => void;
  onDelete: (productId: string) => void;
}

const columns = [
  'Product',
  'SKU',
  'Type',
  'Stock status',
  'Reorder level',
  'Availability',
  'Suppliers',
  'Status',
  'Updated',
  'Actions',
];

export function ProductTable({
  products,
  emptyReason,
  onAddProduct,
  onView,
  onEdit,
  onTrends,
  onDelete,
}: ProductTableProps) {
  if (products.length === 0) {
    const filtered = emptyReason === 'filtered';

    return (
      <div className="grid min-h-80 place-items-center px-6 py-12 text-center">
        <div className="max-w-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand-default">
            {filtered ? (
              <FiSearch aria-hidden="true" className="size-5" />
            ) : (
              <FiBox aria-hidden="true" className="size-5" />
            )}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-text-primary">
            {filtered
              ? 'No products match these filters'
              : 'Create your first product'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {filtered
              ? 'Try a different search or clear one of the filters above.'
              : 'Add the items you buy, make, stock, or sell to begin managing inventory.'}
          </p>
          {!filtered && (
            <Button
              className="mt-5"
              leftIcon={<FiPlus className="size-4" />}
              onClick={onAddProduct}
            >
              Add product
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1480px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-secondary/80">
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={[
                  'whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-secondary',
                  index === 0
                    ? 'sticky left-0 z-20 bg-surface-secondary px-5'
                    : '',
                  index === columns.length - 1
                    ? 'sticky right-0 z-20 bg-surface-secondary text-right'
                    : '',
                ].join(' ')}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onView={onView}
              onEdit={onEdit}
              onTrends={onTrends}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
