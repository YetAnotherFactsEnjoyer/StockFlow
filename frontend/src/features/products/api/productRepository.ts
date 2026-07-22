import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../types/product';

export interface ProductRepository {
  list(): Promise<Product[]>;

  create(
    request: CreateProductRequest,
  ): Promise<Product>;

  updateProduct(
    productId: string,
    request: UpdateProductRequest,
  ): Promise<Product>;

  deleteProduct(
    productId: string,
  ): Promise<void>;
}
