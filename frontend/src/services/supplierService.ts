import api from './api';
import type { Supplier } from '../types/supplier';

const BASE_URL = '/suppliers';

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  async create(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const response = await api.post(BASE_URL, supplier);
    return response.data;
  },

  async update(id: number, supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const response = await api.put(`${BASE_URL}/${id}`, supplier);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  }
};
