import { FiEdit3 } from 'react-icons/fi';
import type { Supplier } from '../types/supplier';

interface Props {
  supplier: Supplier;
  onClose: () => void;
  onEdit: (supplier: Supplier) => void;
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="mt-2 text-sm text-neutral-200">{value || 'Not provided'}</p>
    </div>
  );
}

export default function SupplierDetailsModal({ supplier, onClose, onEdit }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Supplier details
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-100">{supplier.name}</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Review key contact information before you edit or reach out.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 transition hover:border-neutral-500 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <DetailCard label="Contact person" value={supplier.contactPerson} />
          <DetailCard label="Email" value={supplier.email} />
          <DetailCard label="Phone" value={supplier.phone} />
          <DetailCard label="Address" value={supplier.address} />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onEdit(supplier)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-5 py-2.5 text-sm font-semibold text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-500/25"
          >
            <FiEdit3 className="h-4 w-4" aria-hidden="true" />
            Edit Supplier
          </button>
        </div>
      </div>
    </div>
  );
}
