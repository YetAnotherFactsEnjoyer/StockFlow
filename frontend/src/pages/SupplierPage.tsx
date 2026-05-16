import { useEffect, useState } from 'react';
import { FiEdit3, FiInfo, FiMail, FiPlus, FiSearch, FiTrash2, FiTruck, FiUsers } from 'react-icons/fi';
import type { Supplier } from '../types/supplier';
import { supplierService } from '../services/supplierService';
import SupplierModal from '../components/SupplierModal';
import SupplierDetailsModal from '../components/SupplierDetailsModal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter((supplier) => supplier.id !== id)
      );
      setSelectedSupplier(null);
    } catch (err) {
      setError('Failed to delete supplier');
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = searchTerm.toLowerCase();

    return (
      supplier.name.toLowerCase().includes(search) ||
      (supplier.contactPerson ?? '').toLowerCase().includes(search) ||
      (supplier.email ?? '').toLowerCase().includes(search) ||
      (supplier.phone ?? '').toLowerCase().includes(search) ||
      (supplier.address ?? '').toLowerCase().includes(search)
    );
  });
  const suppliersWithEmail = suppliers.filter((supplier) => Boolean(supplier.email)).length;
  const suppliersWithContact = suppliers.filter((supplier) => Boolean(supplier.contactPerson)).length;

  if (loading) return <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-6 py-8 text-sm text-neutral-400">Loading suppliers...</div>;
  if (error) return <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-6 py-8 text-sm text-red-300">{error}</div>;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Network
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Suppliers</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Keep contact details and vendor information organized and easy to update.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-cyan-200"
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Add Supplier
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Total suppliers
            <FiTruck className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{suppliers.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Contacts
            <FiUsers className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{suppliersWithContact}</p>
        </div>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-neutral-400">
            Emails
            <FiMail className="h-4 w-4 text-amber-300" aria-hidden="true" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">{suppliersWithEmail}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900 p-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-xl">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, contact, email, phone, or address..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 py-2.5 pl-10 pr-4 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
          />
        </label>
        <p className="text-sm text-neutral-400">
          Showing {filteredSuppliers.length} of {suppliers.length} suppliers
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/60 px-4 py-3 text-xs text-neutral-400">
          <FiInfo className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          Click a row to open supplier details.
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
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
            {filteredSuppliers.map(supplier => (
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
                    <FiEdit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(supplier.id);
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

          {filteredSuppliers.length === 0 && (
            <div className="py-12 text-center text-neutral-500">
              {searchTerm ? 'No suppliers match your search.' : 'No suppliers yet. Add your first one.'}
            </div>
          )}
        </div>
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
