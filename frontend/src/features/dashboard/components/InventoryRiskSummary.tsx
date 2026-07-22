import type {
  DashboardRiskCategory,
  DashboardRiskViewModel,
} from '../types/dashboardViewModel';

interface InventoryRiskSummaryProps {
  risk: DashboardRiskViewModel;
}

const toneClasses = {
  positive: {
    marker: 'bg-success',
    value: 'text-success',
  },
  warning: {
    marker: 'bg-warning',
    value: 'text-warning',
  },
  critical: {
    marker: 'bg-danger',
    value: 'text-danger',
  },
  neutral: {
    marker: 'bg-text-secondary',
    value: 'text-text-primary',
  },
} as const;

export function InventoryRiskSummary({
  risk,
}: InventoryRiskSummaryProps) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
      <h2 className="text-base font-semibold text-text-primary">
        Inventory Risk
      </h2>
      <p className="mt-1 min-h-10 text-sm leading-5 text-text-secondary">
        {risk.interpretation}
      </p>

      {risk.totalProducts === 0 ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle bg-surface-secondary/50 p-6 text-center">
          <h3 className="font-semibold text-text-primary">
            No active products to assess
          </h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Activate a product to include it in the risk distribution.
          </p>
        </div>
      ) : (
        <>
          <div
            role="img"
            aria-label={risk.textSummary}
            className="mt-6 flex h-3 overflow-hidden rounded-full bg-surface-secondary"
          >
            {risk.categories.map((category) => (
              <span
                key={category.id}
                className={`${toneClasses[category.tone].marker} transition-opacity hover:opacity-80`}
                style={{
                  width: `${percentage(category.count, risk.totalProducts)}%`,
                }}
                title={`${category.label}: ${category.count}`}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-1 flex-col gap-2">
            {risk.categories.map((category) => (
              <RiskRow
                key={category.id}
                category={category}
                percentage={percentage(
                  category.count,
                  risk.totalProducts,
                )}
              />
            ))}
          </div>
        </>
      )}

      <p className="mt-5 border-t border-border-subtle pt-4 text-xs leading-5 text-text-secondary">
        Each product appears once, using its highest-priority operational risk.
      </p>
    </section>
  );
}

function percentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function RiskRow({
  category,
  percentage: percentageValue,
}: {
  category: DashboardRiskCategory;
  percentage: number;
}) {
  const tones = toneClasses[category.tone];
  const isRisk =
    category.id !== 'healthy' && category.count > 0;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-md p-2 ${isRisk ? 'bg-surface-secondary/70' : ''}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={`size-2.5 shrink-0 rounded-sm ${tones.marker}`}
        />
        <div className="min-w-0">
          <p
            className={`text-sm ${isRisk ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}
          >
            {category.label}
          </p>
          <p className="truncate text-xs text-text-secondary">
            {category.description}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className={`text-sm font-semibold ${tones.value}`}>
          {category.count}
        </span>
        <span className="w-9 text-right text-xs text-text-secondary">
          {percentageValue}%
        </span>
      </div>
    </div>
  );
}
