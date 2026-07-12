import type {
  OnboardingState,
  OnboardingStep,
} from '../types/onboarding';
import { defaultOnboardingState } from '../utils/defaultOnboardingState';
import type { OnboardingRepository } from './onboardingRepository';

const STORAGE_KEY = 'stockflow.onboarding';

function cloneDefaultState(): OnboardingState {
  return structuredClone(defaultOnboardingState);
}

export function isOnboardingComplete(
  state: Pick<OnboardingState, 'status' | 'completedSteps'>,
) {
  return (
    state.status === 'completed' ||
    state.completedSteps.includes('review')
  );
}

export function readStoredState(): OnboardingState {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return cloneDefaultState();
  }

  try {
    const storedState = JSON.parse(storedValue) as OnboardingState;

    if (
      storedState.completedSteps?.includes('review') &&
      storedState.status !== 'completed'
    ) {
      return writeStoredState({
        ...storedState,
        status: 'completed',
      });
    }

    return storedState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return cloneDefaultState();
  }
}

function writeStoredState(
  state: OnboardingState,
): OnboardingState {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state),
  );
  return state;
}

export const localOnboardingRepository: OnboardingRepository = {
  async getState() {
    return readStoredState();
  },

 async saveState(state) {
    return writeStoredState(state);
  },

  async updateCurrentStep(step: OnboardingStep) {
    const currentState = readStoredState();

    const updatedState: OnboardingState = {
      ...currentState,
      status: 'in_progress',
      currentStep: step,
    };

    return writeStoredState(updatedState);
  },

  async reset() {
    window.localStorage.removeItem(STORAGE_KEY);
    return cloneDefaultState();
  },
};
