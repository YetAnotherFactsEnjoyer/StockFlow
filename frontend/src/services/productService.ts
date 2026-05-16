import api from "./api";
import type { Product } from "../types/product"; 

const BASE_URL = "/products";

export const productService = {
    async getAll(): Promise<Product[]> {
        const responce = await api.get(BASE_URL);
        return responce.data;
    },
    
    async create(product: Omit<Product, 'id'>): Promise<Product> {
        const responce = await api.post(BASE_URL, product);
        return responce.data;
    },

    async update(id: number, product: Omit<Product, 'id'>): Promise<Product> {
        const responce = await api.put(`${BASE_URL}/${id}`, product);
        return responce.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};
