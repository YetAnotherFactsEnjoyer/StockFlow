export const ONBOARDING_STEPS = [
  'welcome',
  'organization',
  'branding',
  'inventory',
  'team',
  'import',
  'review',
] as const;

export type OnboardingStep =
  (typeof ONBOARDING_STEPS)[number];

export type OnboardingStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed';

export interface OrganizationDraft {
  name: string;
  slug: string;
  industry: string;
  country: string;
  currency: string;
  locale: string;
  timezone: string;
}

export interface BrandingDraft {
  applicationName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  colorMode: 'light' | 'dark' | 'system';
}

export interface InventoryDraft {
  skuRequired: boolean;
  supplierRequired: boolean;
  locationsEnabled: boolean;
  lowStockEnabled: boolean;
  defaultLowStockThreshold: number;
  trackPurchasePrice: boolean;
  valuationMethod: 'FIFO' | 'LIFO' | 'AVG';
  barcodeScanEnabled: boolean;
}

export interface TeamMemberDraft {
  temporaryId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'viewer';
}

export interface ImportDraft {
  mode: 'MANUAL' | 'CSV' | 'SEED';
  fileName: string | null;
  importedRows: number;
  validRows: number;
  invalidRows: number;
}

export interface OnboardingState {
  status: OnboardingStatus;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];

  organization: OrganizationDraft;
  branding: BrandingDraft;
  inventory: InventoryDraft;
  teamMembers: TeamMemberDraft[];
  import: ImportDraft;
}
