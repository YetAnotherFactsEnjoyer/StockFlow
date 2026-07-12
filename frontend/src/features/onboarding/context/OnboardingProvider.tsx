import {
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import type {
  OnboardingState,
} from '../types/onboarding';
import { defaultOnboardingState } from '../utils/defaultOnboardingState';
import {
  OnboardingContext,
  type OnboardingAction,
} from './OnboardingContext';

const STORAGE_KEY = 'stockflow.onboarding';

function cloneDefaultState(): OnboardingState {
  return structuredClone(defaultOnboardingState);
}

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        status: 'in_progress',
        currentStep: action.payload,
      };

    case 'UPDATE_ORGANIZATION':
      return {
        ...state,
        status: 'in_progress',
        organization: {
          ...state.organization,
          ...action.payload,
        },
      };

    case 'UPDATE_BRANDING':
      return {
        ...state,
        status: 'in_progress',
        branding: {
          ...state.branding,
          ...action.payload,
        },
      };

    case 'UPDATE_INVENTORY':
      return {
        ...state,
        status: 'in_progress',
        inventory: {
          ...state.inventory,
          ...action.payload,
        },
      };

    case 'UPDATE_TEAM_MEMBERS':
      return {
        ...state,
        status: 'in_progress',
        teamMembers: action.payload,
      };

    case 'UPDATE_IMPORT':
      return {
        ...state,
        status: 'in_progress',
        import: {
          ...state.import,
          ...action.payload,
        },
      };

    case 'MARK_STEP_COMPLETE':
      if (state.completedSteps.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        status:
          action.payload === 'review'
            ? 'completed'
            : 'in_progress',
        completedSteps: [
          ...state.completedSteps,
          action.payload,
        ],
      };

    case 'RESET':
      return cloneDefaultState();

    default:
      return state;
  }
}

function getStoredState(): OnboardingState {
  if (typeof window === 'undefined') {
    return cloneDefaultState();
  }

  const storedValue =
    window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return cloneDefaultState();
  }

  try {
    const defaultState = cloneDefaultState();
    const storedState = JSON.parse(
      storedValue,
    ) as Partial<OnboardingState>;

    return {
      ...defaultState,
      ...storedState,
      organization: {
        ...defaultState.organization,
        ...storedState.organization,
      },
      branding: {
        ...defaultState.branding,
        ...storedState.branding,
      },
      inventory: {
        ...defaultState.inventory,
        ...storedState.inventory,
      },
      teamMembers:
        storedState.teamMembers ??
        defaultState.teamMembers,
      import: {
        ...defaultState.import,
        ...storedState.import,
      },
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return cloneDefaultState();
  }
}

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    onboardingReducer,
    undefined,
    getStoredState,
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state),
    );
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
