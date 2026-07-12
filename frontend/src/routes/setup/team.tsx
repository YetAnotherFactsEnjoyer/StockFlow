import { createFileRoute } from '@tanstack/react-router';

import TeamStep from '../../features/onboarding/components/TeamStep';

export const Route = createFileRoute('/setup/team')({
  component: TeamStep,
});
