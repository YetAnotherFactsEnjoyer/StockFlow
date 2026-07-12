import {
  createFileRoute,
  Outlet,
} from '@tanstack/react-router';

import { SetupShell } from '../../features/onboarding/components/SetupShell';
import { OnboardingProvider } from '../../features/onboarding/context/OnboardingProvider';

export const Route = createFileRoute('/setup')({
  component: SetupLayoutRoute,
});

function SetupLayoutRoute() {
  return (
    <OnboardingProvider>
      <SetupShell>
        <Outlet />
      </SetupShell>
    </OnboardingProvider>
  );
}
