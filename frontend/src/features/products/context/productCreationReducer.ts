import type {
  ProductCreationState,
} from '../types/productCreation';
import {
  createDefaultProductCreationState,
} from '../utils/createDefaultProductCreationState';
import type {
  ProductCreationAction,
} from './ProductCreationContext';

export function productCreationReducer(
  state: ProductCreationState,
  action: ProductCreationAction,
): ProductCreationState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload,
        currentStep:
          action.payload === 'quick'
            ? 'details'
            : state.currentStep,
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };

    case 'UPDATE_DETAILS':
      return {
        ...state,
        draft: {
          ...state.draft,
          details: {
            ...state.draft.details,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_INVENTORY':
      return {
        ...state,
        draft: {
          ...state.draft,
          inventory: {
            ...state.draft.inventory,
            ...action.payload,
          },
        },
      };

    case 'SET_SUPPLIERS':
      return {
        ...state,
        draft: {
          ...state.draft,
          suppliers: action.payload,
        },
      };

    case 'UPDATE_COMMERCIAL':
      return {
        ...state,
        draft: {
          ...state.draft,
          commercial: {
            ...state.draft.commercial,
            ...action.payload,
          },
        },
      };

    case 'SET_CUSTOMERS':
      return {
        ...state,
        draft: {
          ...state.draft,
          commercial: {
            ...state.draft.commercial,
            customers: action.payload,
          },
        },
      };

    case 'MARK_STEP_COMPLETE':
      return {
        ...state,

        completedSteps:
          state.completedSteps.includes(
            action.payload,
          )
            ? state.completedSteps
            : [
              ...state.completedSteps,
              action.payload,
            ],

        skippedSteps:
          state.skippedSteps.filter(
            (step) =>
              step !== action.payload,
          ),
      };

    case 'SKIP_STEP':
      return {
        ...state,

        completedSteps:
          state.completedSteps.filter(
            (step) =>
              step !== action.payload,
          ),

        skippedSteps:
          state.skippedSteps.includes(
            action.payload,
          )
            ? state.skippedSteps
            : [
              ...state.skippedSteps,
              action.payload,
            ],
      };

    case 'RESET':
      return createDefaultProductCreationState(
        action.payload,
      );

    default:
      return state;
  }
}
