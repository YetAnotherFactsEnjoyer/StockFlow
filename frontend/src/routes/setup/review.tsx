import { createFileRoute } from '@tanstack/react-router';

import ReviewStep from '../../features/onboarding/components/ReviewStep';

export const Route = createFileRoute('/setup/review')({
  component: ReviewStep,
});
