import type {
  Customer,
} from '../types/customer';
import type {
  CustomerRepository,
} from './customerRepository';

const mockCustomers: Customer[] = [
  {
    id: 'customer-orbit-retail',
    name: 'Orbit Retail',
    type: 'business',
    contactName: 'Marcus Lee',
    email: 'marcus@orbit.example',
    phone: '+65 6123 5501',
    active: true,
  },
  {
    id: 'customer-harbour-logistics',
    name: 'Harbour Logistics',
    type: 'business',
    contactName: 'Nadia Rahman',
    email: 'nadia@harbour.example',
    phone: '+65 6123 5502',
    active: true,
  },
  {
    id: 'customer-vertex-services',
    name: 'Vertex Services',
    type: 'business',
    contactName: 'Julian Tan',
    email: 'julian@vertex.example',
    phone: '+65 6123 5503',
    active: true,
  },
];

export const mockCustomerRepository:
  CustomerRepository = {
  async listActive() {
    return mockCustomers
      .filter((customer) => customer.active)
      .map((customer) => ({
        ...customer,
      }));
  },
};
