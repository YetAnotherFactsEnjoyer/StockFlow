import { createFileRoute } from '@tanstack/react-router';

import WelcomeStep from '../../features/onboarding/components/WelcomeStep';

export const Route = createFileRoute('/setup/')({
  component: WelcomeStep,
});
