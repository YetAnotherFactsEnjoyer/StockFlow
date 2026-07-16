export type CustomerType =
  | 'business'
  | 'individual';

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
}
