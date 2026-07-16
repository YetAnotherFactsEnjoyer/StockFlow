import type {
  CreateProductRequest,
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
    return [...readProducts()].sort(
      (firstProduct, secondProduct) =>
        secondProduct.createdAt.localeCompare(
          firstProduct.createdAt,
        ),
    );
  },

  async create(
    request: CreateProductRequest,
  ) {
    const products = readProducts();

    const normalizedSku =
      request.details.sku?.toLowerCase();

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

    const preferredSupplierCount =
      request.suppliers?.filter(
        (supplier) => supplier.preferred,
      ).length ?? 0;

    if (
      request.suppliers &&
      request.suppliers.length > 0 &&
      preferredSupplierCount !== 1
    ) {
      throw new Error(
        'Choose exactly one preferred supplier.',
      );
    }

    const timestamp = new Date().toISOString();
    const defaultAvailability =
      request.details.type === 'finished_good'
        ? 'all_customers'
        : 'internal';

    const product: Product = {
      id: crypto.randomUUID(),

      name: request.details.name,
      sku: request.details.sku,
      description: request.details.description,

      type: request.details.type,
      stockUnit: request.details.stockUnit,
      customStockUnit:
        request.details.customStockUnit,

      stockQuantity:
        request.inventory?.initialQuantity ?? 0,

      reorderLevel:
        request.inventory?.reorderLevel ?? null,

      barcode: request.inventory?.barcode ?? null,

      availability:
        request.commercial?.availability ??
        defaultAvailability,

      defaultSellingPrice:
        request.commercial?.defaultSellingPrice ?? null,

      suppliers:
        request.suppliers?.map((supplier) => ({
          id: crypto.randomUUID(),
          supplierId: supplier.supplierId,
          supplierSku: supplier.supplierSku,
          purchasePrice: supplier.purchasePrice,
          minimumOrderQuantity:
            supplier.minimumOrderQuantity,
          leadTimeDays: supplier.leadTimeDays,
          preferred: supplier.preferred,
        })) ?? [],

      customers:
        request.commercial?.customers.map((customer) => ({
          id: crypto.randomUUID(),
          customerId: customer.customerId,
          customerSku: customer.customerSku,
          sellingPrice: customer.sellingPrice,
          minimumOrderQuantity:
            customer.minimumOrderQuantity,
        })) ?? [],

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
