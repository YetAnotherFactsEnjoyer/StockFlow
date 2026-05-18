import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import type { Supplier } from '../types/supplier';
import { productService } from '../services/productService';
import { supplierService } from '../services/supplierService';

interface Props {
  product?: Product;
  onClose: () => void;
  onSaved: () => void;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return 'Something went wrong';
}

export default function ProductModal({ product, onClose, onSaved }: Props) {

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    sku: product?.sku ?? '',
    price: product?.price ?? '',
    stockQuantity: product?.stockQuantity ?? '',
    supplierId: product?.supplierId ? String(product.supplierId) : '',
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await supplierService.getAll();
        setSuppliers(data);
      } catch {
        setError('Failed to load suppliers');
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        supplierId: Number(form.supplierId),
      };
      if (product) {
        await productService.update(product.id, dto);
      } else {
        await productService.create(dto);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">

        <div className="border-b border-neutral-800 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Product</p>
          <h2 className="mt-1 text-xl font-semibold text-neutral-100">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 p-6">

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

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Supplier</label>
            <select
              name="supplierId"
              value={form.supplierId}
              onChange={handleChange}
              required
              disabled={loadingSuppliers}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-neutral-900 disabled:text-neutral-500"
            >
              <option value="">
                {loadingSuppliers ? 'Loading suppliers...' : 'Select a supplier'}
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
