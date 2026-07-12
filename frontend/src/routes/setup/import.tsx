import { createFileRoute } from '@tanstack/react-router';

import ImportStep from '../../features/onboarding/components/ImportStep';

export const Route = createFileRoute('/setup/import')({
  component: ImportStep,
});
