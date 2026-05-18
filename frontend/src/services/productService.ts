import api from "./api";
import type { Product, ProductDTO } from "../types/product"; 

const BASE_URL = "/products";

export const productService = {
    async getAll(search?: string): Promise<Product[]> {
        const response = await api.get(BASE_URL, { params: search ? { search } : {},});
        return response.data;
    },

    async create(product: ProductDTO): Promise<Product> {
        const responce = await api.post(BASE_URL, product);
        return responce.data;
    },

    async update(id: number, product: ProductDTO): Promise<Product> {
        const responce = await api.put(`${BASE_URL}/${id}`, product);
        return responce.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`${BASE_URL}/${id}`);
    },
};
