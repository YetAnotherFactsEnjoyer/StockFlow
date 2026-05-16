import { useEffect, useState } from 'react';
import { FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
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

  if (loading) return <div className="px-8 py-10 text-sm text-neutral-400">Loading products...</div>;
  if (error) return <div className="px-8 py-10 text-sm text-red-400">{error}</div>;

  return (
    <section className="px-6 py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Inventory
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-100">Products</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Track pricing, stock levels, and SKU details in one place.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-5 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-500/25"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400/20">
            <FiPlus className="h-4 w-4" aria-hidden="true" />
          </span>
          Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, SKU, description, or supplier..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/40 px-6 py-3 text-xs text-neutral-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 font-semibold text-blue-200">
            !
          </span>
          Click a product row to open its detail popup.
        </div>
        <table className="w-full text-sm">
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
            No products yet. Add your first one.
          </div>
        )}
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
