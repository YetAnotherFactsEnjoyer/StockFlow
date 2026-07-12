import type {
  OnboardingState,
  OnboardingStep,
} from '../types/onboarding';

export interface OnboardingRepository {
  getState(): Promise<OnboardingState>;

  saveState(
    state: OnboardingState,
  ): Promise<OnboardingState>;

  updateCurrentStep(
    step: OnboardingStep,
  ): Promise<OnboardingState>;

  reset(): Promise<OnboardingState>;
}
