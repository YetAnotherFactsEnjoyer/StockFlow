import {
  createContext,
  type Dispatch,
} from 'react';

import type {
  BrandingDraft,
  ImportDraft,
  InventoryDraft,
  OnboardingState,
  OnboardingStep,
  OrganizationDraft,
  TeamMemberDraft,
} from '../types/onboarding';

export type OnboardingAction =
  | {
      type: 'HYDRATE';
      payload: OnboardingState;
    }
  | {
      type: 'SET_CURRENT_STEP';
      payload: OnboardingStep;
    }
  | {
      type: 'UPDATE_ORGANIZATION';
      payload: Partial<OrganizationDraft>;
    }
  | {
      type: 'UPDATE_BRANDING';
      payload: Partial<BrandingDraft>;
    }
  | {
      type: 'UPDATE_INVENTORY';
      payload: Partial<InventoryDraft>;
    }
  | {
      type: 'UPDATE_TEAM_MEMBERS';
      payload: TeamMemberDraft[];
    }
  | {
      type: 'UPDATE_IMPORT';
      payload: Partial<ImportDraft>;
    }
  | {
      type: 'MARK_STEP_COMPLETE';
      payload: OnboardingStep;
    }
  | {
      type: 'RESET';
    };

export interface OnboardingContextValue {
  state: OnboardingState;
  dispatch: Dispatch<OnboardingAction>;
}

export const OnboardingContext =
  createContext<OnboardingContextValue | null>(null);
