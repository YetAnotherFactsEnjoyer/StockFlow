export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
}
