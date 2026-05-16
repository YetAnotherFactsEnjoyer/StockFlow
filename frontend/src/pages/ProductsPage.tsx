import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiBox, FiEdit3, FiInfo, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
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
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
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
    const confirmed = confirm('Delete this product?');

    if (!confirmed) {
      return;
    }

    try {
      await productService.delete(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
      setSelectedProduct(null);
    } catch (err) {
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
  const lowStockCount = products.filter((product) => product.stockQuantity < 5).length;
  const outOfStockCount = products.filter((product) => product.stockQuantity === 0).length;

  if (loading) return <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-8 text-sm text-neutral-400">Loading products...</div>;
  if (error) return <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-8 text-sm text-red-300">{error}</div>;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Inventory
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Products</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Track pricing, stock levels, and SKU details in one place.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Total products
            <FiBox className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{products.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Low stock
            <FiAlertTriangle className="h-4 w-4 text-amber-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{lowStockCount}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Out of stock
            <FiAlertTriangle className="h-4 w-4 text-red-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{outOfStockCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-xl">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU, description, or supplier..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
        </label>
        <p className="text-sm text-neutral-400">
          Showing {displayedProducts.length} of {filteredProducts.length} matches
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/60 px-4 py-3 text-xs text-neutral-400">
          <FiInfo className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          Click a row to open product details.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-[0.18em] text-neutral-500">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Supplier</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map(product => (
              <tr
                key={product.id}
                onClick={() => handlePreview(product)}
                className="cursor-pointer border-b border-neutral-800/80 transition hover:bg-neutral-800/70"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-neutral-100">{product.name}</div>
                  <div className="text-xs text-neutral-500">{product.description || 'No description'}</div>
                </td>
                <td className="px-6 py-4 text-neutral-300">{product.supplierName || 'No supplier'}</td>
                <td className="px-6 py-4 font-mono text-neutral-300">{product.sku}</td>
                <td className="px-6 py-4 text-neutral-100">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    product.stockQuantity === 0
                      ? 'bg-red-500/15 text-red-300'
                      : product.stockQuantity < 5
                      ? 'bg-amber-500/15 text-amber-300'
                      : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {product.stockQuantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEdit(product);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-200 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-200"
                  >
                    <FiEdit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(product.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>

          {displayedProducts.length === 0 && (
            <div className="py-12 text-center text-neutral-500">
              {searchTerm ? 'No products match your search.' : 'No products yet. Add your first one.'}
            </div>
          )}
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
