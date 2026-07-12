import type { OnboardingState } from '../types/onboarding';

export const defaultOnboardingState: OnboardingState = {
  status: 'not_started',
  currentStep: 'welcome',
  completedSteps: [],

  organization: {
    name: '',
    slug: '',
    industry: '',
    country: '',
    currency: 'EUR',
    locale: 'en',
    timezone: 'Europe/Paris',
  },

  branding: {
    applicationName: 'StockFlow',
    logoUrl: null,
    primaryColor: '#4f46e5',
    accentColor: '#22c55e',
    colorMode: 'light',
  },

  inventory: {
    skuRequired: true,
    supplierRequired: false,
    locationsEnabled: false,
    lowStockEnabled: true,
    defaultLowStockThreshold: 5,
    trackPurchasePrice: true,
    valuationMethod: 'FIFO',
    barcodeScanEnabled: false,
  },

  teamMembers: [],

  import: {
    mode: 'MANUAL',
    fileName: null,
    importedRows: 0,
    validRows: 0,
    invalidRows: 0,
  },
};
