import type {
  CreateProductRequest,
  Product,
} from '../types/product';

export interface ProductRepository {
  list(): Promise<Product[]>;

  create(
    request: CreateProductRequest,
  ): Promise<Product>;
}
