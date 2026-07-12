import {
  createFileRoute,
  Outlet,
  redirect
} from '@tanstack/react-router';

import { onboardingRepository } from '../features/onboarding/api';
import { onboardingSteps } from '../features/onboarding/config/onboardingSteps';
import { AppLayout } from '../layouts/AppLayout';

export const Route = createFileRoute('/_app')({
    beforeLoad: async () => {
        const state = await onboardingRepository.getState();
        if (state.status === 'completed') {
            return;
        }
        const savedStep = onboardingSteps.find(
            (step) => step.id === state.currentStep,
        );
        throw redirect({
            to: savedStep?.path ?? '/setup',
        });
    },

    component: AppRouteComponent,
});

function AppRouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
