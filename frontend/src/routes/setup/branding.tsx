import { createFileRoute } from '@tanstack/react-router';

import BrandingStep from '../../features/onboarding/components/BrandingStep';

export const Route = createFileRoute('/setup/branding')({
  component: BrandingStep,
});
