import { useEffect, useRef, useState } from 'react';
import {
  FiAlertTriangle,
  FiEdit3,
  FiInfo,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';
import type { Supplier } from '../types/supplier';
import { supplierService } from '../services/supplierService';
import SupplierModal from '../components/SupplierModal';
import SupplierDetailsModal from '../components/SupplierDetailsModal';

export default function SupplierPage() {
  const hasLoadedSuppliers = useRef(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = async (search = searchTerm, showFullLoader = false) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      const data = await supplierService.getAll(search);
      setSuppliers(data);
      setError(null);
    } catch {
      setError('Failed to load suppliers');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    const timeoutId = window.setTimeout(async () => {
      try {
        if (!hasLoadedSuppliers.current) {
          setLoading(true);
        } else {
          setSearching(true);
        }

        const data = await supplierService.getAll(searchTerm);
        if (isCurrent) {
          setSuppliers(data);
          setError(null);
        }
      } catch {
        if (isCurrent) {
          setError('Failed to load suppliers');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
          setSearching(false);
          hasLoadedSuppliers.current = true;
        }
      }
    }, searchTerm ? 250 : 0);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(null);
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this supplier?');

    if (!confirmed) return;

    try {
      await supplierService.delete(id);
      setSuppliers((currentSuppliers) =>
        currentSuppliers.filter((supplier) => supplier.id !== id)
      );
      setSelectedSupplier(null);
    } catch {
      setError('Failed to delete supplier');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handlePreview = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
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

  const displayedSuppliers = filteredSuppliers.slice(0, 5);
  const suppliersWithEmail = suppliers.filter((supplier) => supplier.email).length;
  const suppliersWithPhone = suppliers.filter((supplier) => supplier.phone).length;

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/50 text-sm text-zinc-400 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
          Loading supplier network...
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Partners
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50">
            Suppliers
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Keep your supplier contacts, channels, and locations organized.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 text-sm font-semibold text-zinc-950 shadow-lg shadow-cyan-500/10 transition hover:-translate-y-0.5 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          <FiPlus className="h-4 w-4" aria-hidden="true" />
          Add Supplier
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Total Suppliers</p>
            <FiTruck className="h-4 w-4 text-cyan-300" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{suppliers.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Email Contacts</p>
            <FiMail className="h-4 w-4 text-emerald-300" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{suppliersWithEmail}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">Phone Contacts</p>
            <FiPhone className="h-4 w-4 text-amber-300" aria-hidden="true" />
          </div>
          <p className="mt-4 text-3xl font-bold text-zinc-50">{suppliersWithPhone}</p>
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
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search suppliers..."
              className="h-11 w-full rounded-xl border border-zinc-800 bg-zinc-900/70 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition focus:border-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
          <p className="text-sm text-zinc-500">
            {searching
              ? 'Searching...'
              : `Showing ${displayedSuppliers.length} of ${filteredSuppliers.length} results`}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/70">
                <tr className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {displayedSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    onClick={() => handlePreview(supplier)}
                    className="group cursor-pointer transition hover:bg-zinc-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-100">{supplier.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <FiUsers className="h-3 w-3" aria-hidden="true" />
                        Supplier profile
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {supplier.contactPerson || 'No contact person'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-zinc-300">{supplier.email || 'No email'}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">
                      {supplier.phone || 'No phone'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex max-w-[220px] items-center gap-1 truncate rounded-md bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-200 ring-1 ring-inset ring-cyan-400/20">
                        <FiMapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                        {supplier.address || 'No address'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(supplier);
                          }}
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                          title="Edit"
                        >
                          <FiEdit3 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(supplier.id);
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

            {displayedSuppliers.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/60">
                  <FiSearch className="h-6 w-6 text-zinc-500" />
                </div>
                <h3 className="text-sm font-medium text-zinc-200">No suppliers found</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {searchTerm
                    ? "We couldn't find anything matching your search."
                    : 'Add your first supplier to connect products with partners.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAdd}
                    className="mt-6 text-sm font-medium text-zinc-300 transition hover:text-zinc-50"
                  >
                    + Add New Supplier
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950/60 px-6 py-3 text-xs text-zinc-500">
            <FiInfo className="h-4 w-4" />
            Click anywhere on a row to view full supplier details.
          </div>
        </div>
      </div>

      {showModal && (
        <SupplierModal
          supplier={editingSupplier ?? undefined}
          onClose={handleClose}
          onSaved={() => fetchSuppliers(searchTerm)}
        />
      )}

      {selectedSupplier && !showModal && (
        <SupplierDetailsModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onEdit={handleEdit}
        />
      )}
    </section>
  );
}
