import {
  createFileRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import {
  isOnboardingComplete,
  onboardingRepository,
} from '../../features/onboarding/api';
import { SetupShell } from '../../features/onboarding/components/SetupShell';

export const Route = createFileRoute('/setup')({
  beforeLoad: async () => {
    const state =
      await onboardingRepository.getState();

    if (isOnboardingComplete(state)) {
      throw redirect({
        to: '/',
      });
    }
  },

  component: SetupLayoutRoute,
});

function SetupLayoutRoute() {
  return (
      <SetupShell>
        <Outlet />
      </SetupShell>
  );
}
