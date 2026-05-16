import { useState } from 'react';
import type { Product } from '../types/product';
import { productService } from '../services/productService';

interface Props {
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductModal({ product, onClose, onSaved }: Props) {

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    sku: product?.sku ?? '',
    price: product?.price ?? '',
    stockQuantity: product?.stockQuantity ?? '',
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const dto = {
        name: form.name,
        description: form.description,
        sku: form.sku,
        price: parseFloat(form.price as string),
        stockQuantity: parseInt(form.stockQuantity as string),
      };
      if (product) {
        await productService.update(product.id, dto);
      } else {
        await productService.create(dto);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">

        <h2 className="mb-4 text-lg font-semibold text-neutral-100">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
              disabled={!!product}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-neutral-900 disabled:text-neutral-500"
            />
            {product && (
              <p className="mt-1 text-xs text-neutral-500">SKU cannot be changed</p>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-neutral-300">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm text-neutral-300">Stock</label>
              <input
                name="stockQuantity"
                type="number"
                min="0"
                value={form.stockQuantity}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-neutral-400 transition hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
