import {
  FiArrowDown,
} from 'react-icons/fi';

import type {
  DashboardStockFlowSegment,
} from '../types/dashboardViewModel';

interface StockFlowSummaryProps {
  segments: DashboardStockFlowSegment[];
  onNavigate: (route: '/products') => void;
}

const toneClasses = {
  neutral: {
    node: 'border-text-secondary',
    value: 'text-text-primary',
    border: 'border-border-subtle',
  },
  positive: {
    node: 'border-success',
    value: 'text-success',
    border: 'border-success/20',
  },
  warning: {
    node: 'border-warning',
    value: 'text-warning',
    border: 'border-warning/25',
  },
  critical: {
    node: 'border-danger',
    value: 'text-danger',
    border: 'border-danger/25',
  },
} as const;

export function StockFlowSummary({
  segments,
  onNavigate,
}: StockFlowSummaryProps) {
  return (
    <section className="rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
      <div>
        <h2 className="text-sm font-semibold text-text-primary">
          Stock Flow
        </h2>
        <p className="mt-1 text-xs text-text-secondary">
          Current inventory position from active catalog to replenishment risk
        </p>
      </div>

      <div className="relative mt-6">
        <div
          aria-hidden="true"
          className="absolute left-[12.5%] right-[12.5%] top-[7px] hidden h-px bg-border-subtle md:block"
        />

        <div className="grid gap-2 md:grid-cols-4 md:gap-4">
          {segments.map((segment, index) => {
            const tones = toneClasses[segment.tone];

            return (
              <div
                key={segment.id}
                className="relative flex flex-col"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-[1] mx-auto hidden size-3.5 rounded-full border-[3px] bg-surface md:block ${tones.node}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    segment.route && onNavigate(segment.route)
                  }
                  className={`mt-0 flex min-h-24 w-full items-center justify-between rounded-lg border p-3 text-left outline-none transition hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-brand-default/30 md:mt-2 md:flex-col md:items-center md:justify-start md:border-transparent md:text-center ${tones.border}`}
                >
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      {segment.label}
                    </p>
                    <p
                      className={`mt-1 text-2xl font-semibold tracking-tight ${tones.value}`}
                    >
                      {segment.value}
                    </p>
                  </div>
                  <p className="max-w-32 text-right text-xs leading-5 text-text-secondary md:mt-1 md:text-center">
                    {segment.helper}
                  </p>
                </button>

                {index < segments.length - 1 && (
                  <FiArrowDown
                    aria-hidden="true"
                    className="mx-auto size-4 text-border-subtle md:hidden"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
