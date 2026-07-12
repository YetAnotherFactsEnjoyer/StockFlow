import {
  createFileRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';

import { onboardingRepository } from '../../../features/onboarding/api';
import { SetupShell } from '../../../features/onboarding/components/SetupShell';

export const Route = createFileRoute('/_app/setup')({
  beforeLoad: async () => {
    const state =
      await onboardingRepository.getState();

    if (state.status === 'completed') {
      throw redirect({
        to: '/',
      });
    }
  },

  component: SetupLayoutRoute,
});
