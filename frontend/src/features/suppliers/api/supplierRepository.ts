import type {
  Supplier,
} from '../types/supplier';

export interface SupplierRepository {
  listActive(): Promise<Supplier[]>;
}
