import type {
  CreateProductInput,
  Product,
} from '../types/product';

export interface ProductRepository {
  list(): Promise<Product[]>;

  create(
    input: CreateProductInput,
  ): Promise<Product>;
}
