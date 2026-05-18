import { FiEdit3 } from 'react-icons/fi';
import type { Product } from '../types/product';

interface Props {
  product: Product;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

function formatDate(value?: string) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function ProductDetailsModal({ product, onClose, onEdit }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Product details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-100">{product.name}</h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              {product.description || 'No description added for this product yet.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Supplier</p>
            <p className="mt-2 text-lg font-semibold text-neutral-100">
              {product.supplierName || 'No supplier assigned'}
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">SKU</p>
            <p className="mt-2 font-mono text-lg text-neutral-100">{product.sku}</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Price</p>
            <p className="mt-2 text-lg font-semibold text-neutral-100">${product.price.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Stock level</p>
            <p className="mt-2 text-lg font-semibold text-neutral-100">{product.stockQuantity} units</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Status</p>
            <p className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  product.stockQuantity === 0
                    ? 'bg-red-500/15 text-red-300'
                    : product.stockQuantity < 5
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-emerald-500/15 text-emerald-300'
                }`}
              >
                {product.stockQuantity === 0
                  ? 'Out of stock'
                  : product.stockQuantity < 5
                  ? 'Low stock'
                  : 'Healthy stock'}
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Created</p>
            <p className="mt-2 text-sm text-neutral-300">{formatDate(product.createdAt)}</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Updated</p>
            <p className="mt-2 text-sm text-neutral-300">{formatDate(product.updatedAt)}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-neutral-800 px-6 py-5">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
          >
            <FiEdit3 className="h-4 w-4" aria-hidden="true" />
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}
