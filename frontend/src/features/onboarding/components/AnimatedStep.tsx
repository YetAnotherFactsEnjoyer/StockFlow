import {
  useEffect,
  type ReactNode,
} from 'react';
import { useLocation } from '@tanstack/react-router';

import { onboardingSteps } from '../config/onboardingSteps';

const stepPaths: string[] = onboardingSteps.map(
  (step) => step.path,
);

function getStepIndex(pathname: string) {
  const index = stepPaths.indexOf(pathname);
  return index === -1 ? 0 : index;
}

let previousStepIndex = 0;

export function AnimatedStep({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const currentIndex = getStepIndex(location.pathname);
  const direction =
    currentIndex >= previousStepIndex
      ? 'forward'
      : 'backward';

  useEffect(() => {
    previousStepIndex = currentIndex;
  }, [currentIndex]);

  return (
    <div className="relative flex w-full max-w-none flex-col items-center justify-center overflow-visible">
    <div
        key={location.pathname}
        data-direction={direction}
        className="setup-step-frame flex w-full origin-center flex-col justify-center"
      >
        <div className="setup-step-content w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
