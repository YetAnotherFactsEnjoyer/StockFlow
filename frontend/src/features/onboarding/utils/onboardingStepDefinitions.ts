import type { OnboardingStep } from '../types/onboarding';

export interface OnboardingStepDefinition {
  id: OnboardingStep;
  label: string;
  description: string;
  path: string;
}

export const onboardingStepDefinitions: OnboardingStepDefinition[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    description: 'Start your StockFlow workspace.',
    path: '/setup',
  },
  {
    id: 'organization',
    label: 'Organization',
    description: 'Configure your company identity.',
    path: '/setup/organization',
  },
  {
    id: 'branding',
    label: 'Branding',
    description: 'Personalize the workspace appearance.',
    path: '/setup/branding',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Choose how stock will be managed.',
    path: '/setup/inventory',
  },
  {
    id: 'team',
    label: 'Team',
    description: 'Create administrators and employees.',
    path: '/setup/team',
  },
  {
    id: 'import',
    label: 'Import',
    description: 'Import existing stock data.',
    path: '/setup/import',
  },
  {
    id: 'review',
    label: 'Review',
    description: 'Review and create the workspace.',
    path: '/setup/review',
  },
];
