import type { ReactNode } from 'react';

import { StockFlowLogo } from '../../../shared/components/StockFlowLogo';
import type { OnboardingStepId } from '../config/onboardingSteps';
import { OnboardingProgress } from './OnboardingProgress';

interface OnboardingLayoutProps {
  activeStep: OnboardingStepId;
  completedSteps?: OnboardingStepId[];
  children: ReactNode;
}

export function OnboardingLayout({
  activeStep,
  completedSteps = [],
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[22rem_minmax(0,1fr)]">
      <aside className="relative overflow-hidden border-b border-white/10 px-6 py-8 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
        <div
          aria-hidden="true"
          className="absolute -left-24 -top-24 size-80 rounded-full bg-brand-500/15 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-24 size-80 rounded-full bg-success-500/10 blur-3xl"
        />

        <div className="relative flex h-full flex-col">
          <div>
            <div className="flex items-center gap-3">
              <StockFlowLogo
                markClassName="size-11"
                wordmarkClassName="text-lg"
                subtitle="Workspace setup"
                subtitleClassName="text-slate-400"
              />
            </div>

            <p className="mt-8 max-w-xs text-sm leading-6 text-slate-400">
              Configure an inventory workspace tailored to your
              organization.
            </p>
          </div>

          <div className="mt-10 hidden lg:block">
            <OnboardingProgress
              activeStep={activeStep}
              completedSteps={completedSteps}
            />
          </div>

          <p className="mt-auto hidden pt-8 text-xs text-slate-600 lg:block">
            Open-source inventory management
          </p>
        </div>
      </aside>

      <main className="min-h-[calc(100vh-10rem)] bg-slate-50 px-5 py-8 sm:px-8 lg:grid lg:min-h-screen lg:place-items-center lg:px-12 lg:py-12">
        <section
          key={activeStep}
          className={[
            'w-full max-w-3xl rounded-card',
            'border border-slate-200 bg-white',
            'p-6 shadow-xl shadow-slate-950/5',
            'sm:p-9 lg:p-12',
            'motion-safe:animate-[step-enter_350ms_ease-out]',
          ].join(' ')}
        >
          {children}
        </section>
      </main>
    </div>
  );
}
