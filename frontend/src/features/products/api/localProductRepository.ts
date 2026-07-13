import type {
  CreateProductInput,
  Product,
} from '../types/product';
import type {
  ProductRepository,
} from './productRepository';

const STORAGE_KEY = 'stockflow.products';

function readProducts(): Product[] {
  const storedValue =
    window.localStorage.getItem(
      STORAGE_KEY,
    );

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(
      storedValue,
    ) as Product[];
  } catch {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );

    return [];
  }
}

function writeProducts(
  products: Product[],
) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products),
  );
}

export const localProductRepository:
  ProductRepository = {
  async list() {
    return readProducts();
  },

  async create(
    input: CreateProductInput,
  ) {
    const products = readProducts();

    const normalizedSku =
      input.sku?.toLowerCase();

    if (
      normalizedSku &&
      products.some(
        (product) =>
          product.sku?.toLowerCase() ===
          normalizedSku,
      )
    ) {
      throw new Error(
        'A product with this SKU already exists.',
      );
    }

    const timestamp =
      new Date().toISOString();

    const product: Product = {
      id: crypto.randomUUID(),

      name: input.name,
      sku: input.sku,
      description: input.description,

      type: input.type,
      stockUnit: input.stockUnit,
      customStockUnit:
        input.customStockUnit,

      stockQuantity:
        input.initialQuantity,

      reorderLevel:
        input.reorderLevel,

      barcode: input.barcode,

      availability:
        input.availability,

      active: true,

      createdAt: timestamp,
      updatedAt: timestamp,
    };

    writeProducts([
      ...products,
      product,
    ]);

    return product;
  },
};
