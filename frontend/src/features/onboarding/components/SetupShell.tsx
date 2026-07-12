import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FiCheck, FiPackage, FiTruck } from 'react-icons/fi';
import {
  useLocation,
  useNavigate,
} from '@tanstack/react-router';

import { Button } from '../../../shared/components/Button';
import {
  onboardingSteps,
  type OnboardingStepId,
} from '../config/onboardingSteps';
import { useOnboarding } from '../context/useOnboarding';
import { AnimatedStep } from './AnimatedStep';
import { StockFlowLogo } from '../../../shared/components/StockFlowLogo';
import { onboardingRepository } from '../api';

function getActiveStep(
  pathname: string,
): OnboardingStepId {
  const match = onboardingSteps.find(
    (step) => step.path === pathname,
  );

  return match?.id ?? 'welcome';
}

function getStepPath(
  currentStep: OnboardingStepId,
  offset: number,
) {
  const currentIndex = onboardingSteps.findIndex(
    (step) => step.id === currentStep,
  );
  const nextIndex = currentIndex + offset;

  return onboardingSteps[nextIndex]?.path;
}

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function SetupShell({
  children,
}: {
  children: ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [isShipping, setIsShipping] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const { state, dispatch } = useOnboarding();
  const activeStep = getActiveStep(location.pathname);
  const currentIndex = onboardingSteps.findIndex(
    (step) => step.id === activeStep,
  );
  const progress = (currentIndex + 1) / onboardingSteps.length;
  const isWelcomeStep = activeStep === 'welcome';
  const isReviewStep = activeStep === 'review';
  const previousPath = getStepPath(activeStep, -1);
  const nextPath = getStepPath(activeStep, 1);

  useEffect(() => {
    dispatch({
      type: 'SET_CURRENT_STEP',
      payload: activeStep,
    });
  }, [activeStep, dispatch]);

  async function handleBack() {
    if (!previousPath) {
      return;
    }

    await navigate({
      to: previousPath,
    });
  }

  async function handleContinue() {
  if (isReviewStep) {
    if (isShipping || isDelivered) {
      return;
    }

    setIsShipping(true);

    await new Promise((resolve) =>
      window.setTimeout(
        resolve,
        reduceMotion ? 150 : 1750,
      ),
    );

    // Add the completion code here
    const completedState = {
      ...state,
      status: 'completed' as const,
      currentStep: 'review' as const,
      completedSteps:
        state.completedSteps.includes('review')
          ? state.completedSteps
          : [
              ...state.completedSteps,
              'review' as const,
            ],
    };

    await onboardingRepository.saveState(
      completedState,
    );

    dispatch({
      type: 'HYDRATE',
      payload: completedState,
    });

    setIsDelivered(true);

    await new Promise((resolve) =>
      window.setTimeout(
        resolve,
        reduceMotion ? 200 : 900,
      ),
    );

    await navigate({
      to: '/',
    });

    return;
  }

  dispatch({
    type: 'MARK_STEP_COMPLETE',
    payload: activeStep,
  });

  if (!nextPath) {
    return;
  }

  await navigate({
    to: nextPath,
  });
}

  return (
    <div className="relative flex min-h-screen w-full select-none flex-col overflow-hidden bg-[#f8f9fa] text-text-primary">
      <header className="relative z-10 flex h-20 shrink-0 items-center justify-between px-5 sm:px-8">
        <StockFlowLogo
          markClassName="size-9"
          wordmarkClassName="text-sm"
          subtitle="Setup"
        />

        <div className="hidden w-52 items-center gap-4 sm:flex">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-border-subtle">
            <div
              className="h-full rounded-full bg-brand-default transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{
                width: `${progress * 100}%`,
              } as CSSProperties}
            />
          </div>

          <span className="whitespace-nowrap font-mono text-xs text-text-secondary">
            {currentIndex + 1} of {onboardingSteps.length}
          </span>
        </div>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-6 py-10 sm:px-10">
        {isDelivered ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-success text-white">
              <FiCheck className="size-7" />
            </span>
            <h1 className="mt-5 text-3xl font-bold text-text-primary">Workspace delivered</h1>
            <p className="mt-2 text-text-secondary">Your StockFlow setup is complete and ready to use.</p>
          </motion.div>
        ) : (
          <motion.div
            animate={
              isShipping && !reduceMotion
                ? { opacity: 0, scale: 0.08, x: 210, y: 36, rotate: 4 }
                : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
            }
            transition={{ duration: reduceMotion ? 0.1 : 0.68, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <AnimatedStep>{children}</AnimatedStep>
          </motion.div>
        )}

        {isShipping && !isDelivered && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden" aria-hidden="true">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.42, duration: 0.3 }}
              className="relative flex items-end"
            >
              <motion.span
                initial={{ x: -95, y: -8, rotate: -8 }}
                animate={{
                  x: [-95, 18, 18],
                  y: [-8, 2, 2],
                  rotate: [-8, 0, 0],
                  scale: [1, 0.62, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  delay: reduceMotion ? 0 : 0.55,
                  duration: reduceMotion ? 0.1 : 0.58,
                  times: [0, 0.78, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute left-0 bottom-5 flex size-16 items-center justify-center rounded-xl bg-brand-default text-white shadow-sm"
              >
                <FiPackage className="size-8" />
              </motion.span>

              <motion.div
                initial={{ x: 20 }}
                animate={reduceMotion ? undefined : { x: [20, 20, 520] }}
                transition={{ duration: 1.25, times: [0, 0.55, 1], ease: 'easeInOut' }}
                className="flex items-center gap-3 rounded-2xl bg-text-primary px-6 py-4 text-surface shadow-sm"
              >
                <FiTruck className="size-12" />
                <div className="pr-2">
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60">StockFlow</p>
                  <p className="text-sm font-bold">Shipping workspace</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="relative z-10 mx-auto flex h-24 w-full max-w-4xl shrink-0 items-center justify-between px-6 sm:px-10">
        <div>
          {!isWelcomeStep && previousPath && (
            <Button
              variant="ghost"
              leftIcon={<ArrowLeftIcon />}
              onClick={() => void handleBack()}
              className="px-0 hover:-translate-x-0.5 hover:bg-transparent"
            >
              Go back
            </Button>
          )}
        </div>

        <Button
          onClick={() => void handleContinue()}
          disabled={isShipping || isDelivered}
          className="rounded-xl bg-text-primary px-6 shadow-sm hover:bg-black focus-visible:ring-brand-default"
        >
          {isReviewStep
            ? 'Complete Setup'
            : 'Continue'}
          {isReviewStep ? <CheckIcon /> : <ArrowRightIcon />}
        </Button>
      </footer>
    </div>
  );
}
