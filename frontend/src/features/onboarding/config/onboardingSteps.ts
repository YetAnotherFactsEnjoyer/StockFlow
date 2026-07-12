export const onboardingSteps = [
  {
    id: 'welcome',
    number: 1,
    label: 'Welcome',
    description: 'Introduction',
    path: '/setup',
  },
  {
    id: 'organization',
    number: 2,
    label: 'Organization',
    description: 'Company details',
    path: '/setup/organization',
  },
  {
    id: 'branding',
    number: 3,
    label: 'Branding',
    description: 'Visual identity',
    path: '/setup/branding',
  },
  {
    id: 'inventory',
    number: 4,
    label: 'Inventory',
    description: 'Stock preferences',
    path: '/setup/inventory',
  },
  {
    id: 'team',
    number: 5,
    label: 'Team',
    description: 'Users and roles',
    path: '/setup/team',
  },
  {
    id: 'import',
    number: 6,
    label: 'Import',
    description: 'Existing data',
    path: '/setup/import',
  },
  {
    id: 'review',
    number: 7,
    label: 'Review',
    description: 'Confirm workspace',
    path: '/setup/review',
  },
] as const;

export type OnboardingStepId =
  (typeof onboardingSteps)[number]['id'];

export type OnboardingStepPath =
  (typeof onboardingSteps)[number]['path'];
