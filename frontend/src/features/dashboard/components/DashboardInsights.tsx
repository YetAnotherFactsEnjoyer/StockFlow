import type {
  IconType,
} from 'react-icons';
import {
  FiAlertTriangle,
  FiCheck,
  FiMinus,
} from 'react-icons/fi';

import type {
  DashboardInsight,
} from '../types/dashboardViewModel';

interface DashboardInsightsProps {
  insights: DashboardInsight[];
}

const insightTones: Record<
  DashboardInsight['tone'],
  {
    icon: IconType;
    iconClass: string;
  }
> = {
  positive: {
    icon: FiCheck,
    iconClass: 'text-success',
  },
  warning: {
    icon: FiAlertTriangle,
    iconClass: 'text-warning',
  },
  neutral: {
    icon: FiMinus,
    iconClass: 'text-text-secondary',
  },
};

export function DashboardInsights({
  insights,
}: DashboardInsightsProps) {
  const primaryInsight = insights[0];
  const secondaryInsights = insights.slice(1);

  return (
    <section className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
      <h2 className="text-base font-semibold text-text-primary">
        What Changed
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Deterministic signals from the current inventory state
      </p>

      {!primaryInsight ? (
        <div className="flex flex-1 items-center justify-center py-8 text-sm text-text-secondary">
          No significant changes to report.
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          <PrimaryInsight insight={primaryInsight} />

          {secondaryInsights.length > 0 && (
            <ol className="space-y-4 px-1">
              {secondaryInsights.map((insight, index) => {
                const tone = insightTones[insight.tone];
                const Icon = tone.icon;

                return (
                  <li
                    key={insight.id}
                    className="grid grid-cols-[1rem_1rem_minmax(0,1fr)] items-start gap-3"
                  >
                    <span className="pt-0.5 text-right text-xs font-semibold text-text-secondary/60">
                      {index + 2}.
                    </span>
                    <Icon
                      aria-hidden="true"
                      className={`mt-0.5 size-4 ${tone.iconClass}`}
                    />
                    <div>
                      <p className="text-sm font-medium leading-5 text-text-primary">
                        {insight.title}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-text-secondary">
                        {insight.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}

function PrimaryInsight({
  insight,
}: {
  insight: DashboardInsight;
}) {
  const tone = insightTones[insight.tone];
  const Icon = tone.icon;

  return (
    <article className="rounded-lg border border-border-subtle bg-surface-secondary/60 p-4">
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={`mt-0.5 size-4 shrink-0 ${tone.iconClass}`}
        />
        <div>
          <h3 className="text-sm font-semibold leading-5 text-text-primary">
            {insight.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {insight.description}
          </p>
        </div>
      </div>
    </article>
  );
}
