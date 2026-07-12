import { Link } from '@tanstack/react-router';

import {
  onboardingSteps,
  type OnboardingStepId,
} from '../config/onboardingSteps';

interface OnboardingProgressProps {
  activeStep: OnboardingStepId;
  completedSteps?: OnboardingStepId[];
}

export function OnboardingProgress({
  activeStep,
  completedSteps = [],
}: OnboardingProgressProps) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
      {onboardingSteps.map((step) => {
        const isActive = step.id === activeStep;
        const isCompleted =
          completedSteps.includes(step.id);

        return (
          <li key={step.id}>
            <Link
              to={step.path}
              className={[
                'group flex items-center gap-3 rounded-xl px-3 py-3',
                'transition duration-200 ease-out',
                isActive
                  ? 'bg-brand-soft'
                  : 'hover:bg-surface-secondary',
              ].join(' ')}
            >
              <span
                className={[
                  'grid size-9 shrink-0 place-items-center rounded-full border',
                  'text-sm font-semibold transition duration-200',
                  isCompleted
                    ? 'border-success bg-success text-white'
                    : isActive
                      ? 'border-brand-default bg-brand-default text-white'
                      : 'border-border-subtle text-text-secondary group-hover:border-slate-400',
                ].join(' ')}
              >
                {isCompleted ? (
                  <span aria-label="Completed">✓</span>
                ) : (
                  step.number
                )}
              </span>

              <span className="min-w-0">
                <strong
                  className={[
                    'block truncate text-sm',
                    isActive
                      ? 'text-text-primary'
                      : 'text-slate-700',
                  ].join(' ')}
                >
                  {step.label}
                </strong>

                <small className="mt-0.5 block truncate text-xs text-text-secondary">
                  {step.description}
                </small>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
