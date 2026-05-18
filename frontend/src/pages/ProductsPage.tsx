import { useEffect, useState } from 'react';
import {
  FiAlertTriangle,
  FiBox,
  FiEdit3,
  FiInfo,
  FiPlus,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi';
import type { Product } from '../types/product';
import { productService } from '../services/productService';
import ProductModal from '../components/ProductModal';
import ProductDetailsModal from '../components/ProductDetailsModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await productService.getAll();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(null);
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this product?');

    if (!confirmed) return;

    try {
      await productService.delete(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
      setSelectedProduct(null);
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handlePreview = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePreview = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();

    return (
      product.name.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search) ||
      (product.description ?? '').toLowerCase().includes(search) ||
      (product.supplierName ?? '').toLowerCase().includes(search)
    );
  });

  const displayedProducts = filteredProducts.slice(0, 5);
  const lowStockCount = products.filter(
    (product) => product.stockQuantity < 5 && product.stockQuantity > 0
  ).length;
  const outOfStockCount = products.filter(
    (product) => product.stockQuantity === 0
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-400 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          Loading inventory...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
        <FiAlertTriangle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Inventory
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
            Products
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Manage your product catalog, pricing, and stock levels.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 transition hover:-translate-y-0.5 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Products</p>
            <FiBox className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Low Stock</p>
            <FiAlertTriangle className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{lowStockCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Out of Stock</p>
            <FiAlertTriangle className="h-4 w-4 text-red-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{outOfStockCount}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/70 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          <p className="text-sm text-zinc-500">
            Showing {displayedProducts.length} of {filteredProducts.length} results
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/70">
                <tr className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {displayedProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => handlePreview(product)}
                    className="group cursor-pointer transition hover:bg-zinc-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-100">{product.name}</div>
                      <div className="mt-1 line-clamp-1 text-xs text-zinc-500">
                        {product.description || 'No description provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {product.supplierName || 'No supplier'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-zinc-400">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-300">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          product.stockQuantity === 0
                            ? 'bg-red-500/10 text-red-300 ring-red-500/20'
                            : product.stockQuantity < 5
                            ? 'bg-amber-500/10 text-amber-300 ring-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20'
                        }`}
                      >
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(product);
                          }}
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                          title="Edit"
                        >
                          <FiEdit3 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/60">
                  <FiSearch className="h-6 w-6 text-zinc-500" />
                </div>
                <h3 className="text-sm font-medium text-zinc-200">No products found</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {searchTerm
                    ? "We couldn't find anything matching your search."
                    : 'Get started by adding your first product to the inventory.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAdd}
                    className="mt-6 text-sm font-medium text-zinc-300 transition hover:text-zinc-50"
                  >
                    + Add New Product
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950/60 px-6 py-3 text-xs text-zinc-500">
            <FiInfo className="h-4 w-4" />
            Click anywhere on a row to view full product details.
          </div>
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct ?? undefined}
          onClose={handleClose}
          onSaved={fetchProducts}
        />
      )}

      {selectedProduct && !showModal && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={handleClosePreview}
          onEdit={handleEdit}
        />
      )}
    </section>
  );
}
