import {
  customerRepository,
} from '../../customers/api';
import {
  productRepository,
} from '../../products/api';
import {
  supplierRepository,
} from '../../suppliers/api';
import type {
  DashboardOverview,
  DashboardProductSnapshot,
} from '../types/dashboard';
import type {
  DashboardRepository,
} from './dashboardRepository';

const productTypes = new Set([
  'finished_good',
  'raw_material',
  'component',
  'consumable',
  'packaging',
  'other',
]);

const stockUnits = new Set([
  'unit',
  'kilogram',
  'gram',
  'liter',
  'meter',
  'box',
  'pallet',
  'custom',
]);

const customerAvailabilities = new Set([
  'internal',
  'all_customers',
  'selected_customers',
]);

function getLatestUpdate(
  products: DashboardProductSnapshot[],
) {
  const validDates = products
    .map((product) => product.updatedAt)
    .filter((value) =>
      Number.isFinite(new Date(value).getTime()),
    )
    .sort((first, second) =>
      second.localeCompare(first),
    );

  return validDates[0] ?? null;
}

export const localDashboardRepository:
  DashboardRepository = {
  async getOverview() {
    const [products, suppliers, customers] =
      await Promise.all([
        productRepository.list(),
        supplierRepository.listActive(),
        customerRepository.listActive(),
      ]);

    const snapshots: DashboardProductSnapshot[] =
      products.map((product) => ({
        id: product.id,
        name:
          typeof product.name === 'string' &&
          product.name.trim()
            ? product.name
            : 'Unnamed product',
        sku:
          typeof product.sku === 'string'
            ? product.sku
            : null,
        type: productTypes.has(product.type)
          ? product.type
          : 'other',
        stockUnit: stockUnits.has(product.stockUnit)
          ? product.stockUnit
          : 'unit',
        customStockUnit:
          typeof product.customStockUnit === 'string'
            ? product.customStockUnit
            : null,
        stockQuantity: Number.isFinite(
          product.stockQuantity,
        )
          ? product.stockQuantity
          : 0,
        reorderLevel: Number.isFinite(
          product.reorderLevel,
        )
          ? product.reorderLevel
          : null,
        availability: customerAvailabilities.has(
          product.availability,
        )
          ? product.availability
          : 'internal',
        supplierIds: Array.isArray(product.suppliers)
          ? product.suppliers
              .map((supplier) => supplier?.supplierId)
              .filter(
                (supplierId): supplierId is string =>
                  typeof supplierId === 'string',
              )
          : [],
        customerIds: Array.isArray(product.customers)
          ? product.customers
              .map((customer) => customer?.customerId)
              .filter(
                (customerId): customerId is string =>
                  typeof customerId === 'string',
              )
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
      }));

    const overview: DashboardOverview = {
      capturedAt: new Date().toISOString(),
      updatedAt: getLatestUpdate(snapshots),
      products: snapshots,
      activeSupplierIds: suppliers.map(
        (supplier) => supplier.id,
      ),
      activeCustomerIds: customers.map(
        (customer) => customer.id,
      ),
      movements: {
        status: 'unavailable',
      },
      upcomingDeliveries: {
        status: 'unavailable',
      },
    };

    return overview;
  },
};
