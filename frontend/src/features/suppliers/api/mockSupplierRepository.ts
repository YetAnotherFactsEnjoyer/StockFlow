import type {
  Supplier,
} from '../types/supplier';
import type {
  SupplierRepository,
} from './supplierRepository';

const mockSuppliers: Supplier[] = [
  {
    id: 'supplier-northstar',
    name: 'Northstar Distribution',
    contactName: 'Amelia Tan',
    email: 'amelia@northstar.example',
    phone: '+65 6123 4501',
    active: true,
  },
  {
    id: 'supplier-pacific',
    name: 'Pacific Components',
    contactName: 'Daniel Lim',
    email: 'daniel@pacific.example',
    phone: '+65 6123 4502',
    active: true,
  },
  {
    id: 'supplier-meridian',
    name: 'Meridian Wholesale',
    contactName: 'Sarah Wong',
    email: 'sarah@meridian.example',
    phone: '+65 6123 4503',
    active: true,
  },
];

export const mockSupplierRepository:
  SupplierRepository = {
  async listActive() {
    return mockSuppliers
      .filter((supplier) => supplier.active)
      .map((supplier) => ({
        ...supplier,
      }));
  },
};
