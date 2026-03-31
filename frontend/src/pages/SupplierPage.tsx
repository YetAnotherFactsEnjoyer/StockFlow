import { useEffect, useState } from 'react';
import type { Supplier } from '../types/supplier';
import { supplierService } from '../services/supplierService';
import SupplierModal from '../components/SupplierModal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

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
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
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

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
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
              <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{supplier.name}</td>
                <td className="px-6 py-4 text-gray-600">{supplier.contactPerson || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{supplier.email || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{supplier.phone || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{supplier.address || '-'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
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
    </div>
  );
}
