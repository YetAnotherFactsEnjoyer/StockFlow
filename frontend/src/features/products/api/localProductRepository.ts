import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../types/product';
import type {
  ProductRepository,
} from './productRepository';

const STORAGE_KEY = 'stockflow.products';

function normalizeProduct(
  product: Product,
): Product {
  return {
    ...product,
    sku:
      typeof product.sku === 'string'
        ? product.sku
        : null,
    description:
      typeof product.description === 'string'
        ? product.description
        : null,
    customStockUnit:
      typeof product.customStockUnit === 'string'
        ? product.customStockUnit
        : null,
    stockQuantity:
      Number.isFinite(product.stockQuantity)
        ? product.stockQuantity
        : 0,
    reorderLevel:
      Number.isFinite(product.reorderLevel)
        ? product.reorderLevel
        : null,
    barcode:
      typeof product.barcode === 'string'
        ? product.barcode
        : null,
    defaultSellingPrice:
      Number.isFinite(product.defaultSellingPrice)
        ? product.defaultSellingPrice
        : null,
    suppliers: Array.isArray(product.suppliers)
      ? product.suppliers
      : [],
    customers: Array.isArray(product.customers)
      ? product.customers
      : [],
    active: product.active !== false,
    createdAt:
      typeof product.createdAt === 'string'
        ? product.createdAt
        : '',
    updatedAt:
      typeof product.updatedAt === 'string'
        ? product.updatedAt
        : '',
  };
}

function readProducts(): Product[] {
  const storedValue =
    window.localStorage.getItem(
      STORAGE_KEY,
    );

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(
      storedValue,
    ) as Product[];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.map(normalizeProduct);
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

function validateRequest(
  products: Product[],
  request: CreateProductRequest,
  ignoredProductId?: string,
) {
  const normalizedSku =
    request.details.sku?.trim().toLowerCase();

  if (
    normalizedSku &&
    products.some(
      (product) =>
        product.id !== ignoredProductId &&
        product.sku?.trim().toLowerCase() ===
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

    validateRequest(products, request);

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

  async updateProduct(
    productId: string,
    request: UpdateProductRequest,
  ) {
    const products = readProducts();
    const productIndex = products.findIndex(
      (product) => product.id === productId,
    );

    if (productIndex < 0) {
      throw new Error('Product not found.');
    }

    validateRequest(products, request, productId);

    const existingProduct = products[productIndex];
    const defaultAvailability =
      request.details.type === 'finished_good'
        ? 'all_customers'
        : 'internal';
    const existingSuppliers = new Map(
      existingProduct.suppliers.map((supplier) => [
        supplier.supplierId,
        supplier,
      ]),
    );
    const existingCustomers = new Map(
      existingProduct.customers.map((customer) => [
        customer.customerId,
        customer,
      ]),
    );

    const updatedProduct: Product = {
      ...existingProduct,
      name: request.details.name,
      sku: request.details.sku,
      description: request.details.description,
      type: request.details.type,
      stockUnit: request.details.stockUnit,
      customStockUnit:
        request.details.customStockUnit,
      stockQuantity:
        request.inventory?.initialQuantity ??
        existingProduct.stockQuantity,
      reorderLevel:
        request.inventory?.reorderLevel ?? null,
      barcode:
        request.inventory?.barcode ?? null,
      availability:
        request.commercial?.availability ??
        defaultAvailability,
      defaultSellingPrice:
        request.commercial?.defaultSellingPrice ?? null,
      suppliers:
        request.suppliers?.map((supplier) => ({
          id:
            existingSuppliers.get(supplier.supplierId)?.id ??
            crypto.randomUUID(),
          ...supplier,
        })) ?? [],
      customers:
        request.commercial?.customers.map((customer) => ({
          id:
            existingCustomers.get(customer.customerId)?.id ??
            crypto.randomUUID(),
          ...customer,
        })) ?? [],
      active: request.active,
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
    writeProducts(products);

    return updatedProduct;
  },

  async deleteProduct(productId: string) {
    const products = readProducts();
    const remainingProducts = products.filter(
      (product) => product.id !== productId,
    );

    if (remainingProducts.length === products.length) {
      throw new Error('Product not found.');
    }

    writeProducts(remainingProducts);
  },
};
