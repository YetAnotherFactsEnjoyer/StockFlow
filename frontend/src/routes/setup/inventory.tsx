import { createFileRoute } from '@tanstack/react-router';

import InventoryStep from '../../features/onboarding/components/InventoryStep';

export const Route = createFileRoute('/setup/inventory')({
  component: InventoryStep,
});
