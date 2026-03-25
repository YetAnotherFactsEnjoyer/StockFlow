import axios from 'axios';
import type { Product, ProductDTO } from '../types/product';
const BASE_URL = 'http://localhost:8080/api/products';

export const productService = {

  getAll: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(BASE_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await axios.get<Product>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (dto: ProductDTO): Promise<Product> => {
    const response = await axios.post<Product>(BASE_URL, dto);
    return response.data;
  },

  update: async (id: number, dto: ProductDTO): Promise<Product> => {
    const response = await axios.put<Product>(`${BASE_URL}/${id}`, dto);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

};
