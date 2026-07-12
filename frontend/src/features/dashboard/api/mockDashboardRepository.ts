import type { DashboardOverview } from '../types/dashboard';
import type { DashboardRepository } from './dashboardRepository';

const mockDashboardOverview: DashboardOverview = {
  summary: {
    totalProducts: 248,
    totalUnits: 1840,
    lowStockProducts: 12,
    inventoryValue: 42850,
    activeSuppliers: 36,
  },

  attentionItems: [
    {
      productId: 'product-1',
      productName: 'Shipping labels',
      sku: 'LBL-1102',
      currentStock: 19,
      reorderLevel: 30,
      status: 'low_stock',
    },
    {
      productId: 'product-2',
      productName: 'Wireless scanner',
      sku: 'SCN-2048',
      currentStock: 8,
      reorderLevel: 15,
      status: 'low_stock',
    },
    {
      productId: 'product-3',
      productName: 'Packing tape',
      sku: 'TAP-0094',
      currentStock: 6,
      reorderLevel: 20,
      status: 'low_stock',
    },
  ],

  recentActivity: [
    {
      id: 'movement-1',
      productId: 'product-4',
      productName: 'Storage bins',
      sku: 'BIN-4400',
      type: 'stock_in',
      quantity: 40,
      createdAt: '2026-07-12T09:30:00.000Z',
      performedBy: 'Alex Morgan',
    },
    {
      id: 'movement-2',
      productId: 'product-2',
      productName: 'Wireless scanner',
      sku: 'SCN-2048',
      type: 'stock_out',
      quantity: 4,
      createdAt: '2026-07-12T08:15:00.000Z',
      performedBy: 'Sam Lee',
    },
    {
      id: 'movement-3',
      productId: 'product-1',
      productName: 'Shipping labels',
      sku: 'LBL-1102',
      type: 'adjustment',
      quantity: -2,
      createdAt: '2026-07-11T16:45:00.000Z',
      performedBy: null,
    },
  ],
  updatedAt: '2026-07-12T10:00:00.000Z',
};

export const mockDashboardRepository: DashboardRepository = {
  async getOverview() {
    return structuredClone(mockDashboardOverview);
  },
};
