export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  supplierId: number | null;
  supplierName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  supplierId: number;
}
