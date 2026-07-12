import { createFileRoute } from '@tanstack/react-router';

import OrganizationStep from '../../features/onboarding/components/OrganizationStep';

export const Route = createFileRoute(
  '/setup/organization',
)({
  component: OrganizationStep,
});
