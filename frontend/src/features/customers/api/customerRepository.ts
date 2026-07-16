import type {
  Customer,
} from '../types/customer';

export interface CustomerRepository {
  listActive(): Promise<Customer[]>;
}
