import {
  createFileRoute,
  Outlet,
  redirect
} from '@tanstack/react-router';

import { onboardingRepository } from '../features/onboarding/api';
import { onboardingSteps } from '../features/onboarding/config/onboardingSteps';
import { AppLayout } from '../layouts/AppLayout';
import { OnboardingRepository } from '../features/onboarding/api/onboardingRepository';

export const Route = createFileRoute('/_app')({
    beforeLoad: async () => {
        const state = await onboardingRepository.getState();
        if (state.status === 'completed') {
            return;
        }
        const savedStep = await onboardingSteps.find(
            (step) => step.id === step.currentStep,
        );
        throw redirect({
            to: savedStep?.path ?? '/setup',
        })
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
