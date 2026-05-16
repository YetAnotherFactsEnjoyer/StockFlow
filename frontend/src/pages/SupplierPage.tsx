import { useEffect, useState } from 'react';
import type { Supplier } from '../types/supplier';
import { supplierService } from '../services/supplierService';
import SupplierModal from '../components/SupplierModal';
import SupplierDetailsModal from '../components/SupplierDetailsModal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(null);
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handlePreview = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleClosePreview = () => {
    setSelectedSupplier(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this supplier?')) return;

    try {
      await supplierService.delete(id);
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  if (loading) return <div className="px-8 py-10 text-sm text-neutral-400">Loading suppliers...</div>;
  if (error) return <div className="px-8 py-10 text-sm text-red-400">{error}</div>;

  return (
    <section className="px-6 pb-8 md:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            Network
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-100">Suppliers</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Keep contact details and vendor information organized and easy to update.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-5 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-500/25"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-400/20 text-base leading-none">+</span>
          Add Supplier
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-[0.18em] text-neutral-500">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr
                key={supplier.id}
                onClick={() => handlePreview(supplier)}
                className="cursor-pointer border-b border-neutral-800/80 transition hover:bg-neutral-800/70"
              >
                <td className="px-6 py-4 font-medium text-neutral-100">{supplier.name}</td>
                <td className="px-6 py-4 text-neutral-300">{supplier.contactPerson || '-'}</td>
                <td className="px-6 py-4 text-neutral-300">{supplier.email || '-'}</td>
                <td className="px-6 py-4 text-neutral-300">{supplier.phone || '-'}</td>
                <td className="px-6 py-4 text-neutral-400">{supplier.address || '-'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEdit(supplier);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-200 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-200"
                  >
                    <span className="text-sm leading-none">✦</span>
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(supplier.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                  >
                    <span className="text-sm leading-none">×</span>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            No suppliers yet. Add your first one.
          </div>
        )}
      </div>

      {showModal && (
        <SupplierModal
          supplier={editingSupplier ?? undefined}
          onClose={handleClose}
          onSaved={fetchSuppliers}
        />
      )}

      {selectedSupplier && !showModal && (
        <SupplierDetailsModal
          supplier={selectedSupplier}
          onClose={handleClosePreview}
          onEdit={handleEdit}
        />
      )}
    </section>
  );
}
