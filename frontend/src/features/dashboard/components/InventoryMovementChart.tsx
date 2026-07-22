import {
  lazy,
  Suspense,
} from 'react';
import {
  FiBarChart2,
} from 'react-icons/fi';

import type {
  DashboardMovementViewModel,
} from '../types/dashboardViewModel';

interface InventoryMovementChartProps {
  movement: DashboardMovementViewModel;
  periodLabel: string;
}

const previewMovement: DashboardMovementViewModel = {
  status: 'ready',
  points: [
    {
      date: 'preview-1',
      label: 'Mon',
      received: 24,
      consumed: 10,
      adjusted: 0,
    },
    {
      date: 'preview-2',
      label: 'Tue',
      received: 18,
      consumed: 15,
      adjusted: -2,
    },
    {
      date: 'preview-3',
      label: 'Wed',
      received: 32,
      consumed: 12,
      adjusted: 3,
    },
    {
      date: 'preview-4',
      label: 'Thu',
      received: 12,
      consumed: 22,
      adjusted: 0,
    },
    {
      date: 'preview-5',
      label: 'Fri',
      received: 40,
      consumed: 18,
      adjusted: -1,
    },
    {
      date: 'preview-6',
      label: 'Sat',
      received: 27,
      consumed: 16,
      adjusted: 2,
    },
    {
      date: 'preview-7',
      label: 'Sun',
      received: 35,
      consumed: 20,
      adjusted: 0,
    },
  ],
  textSummary:
    'Preview only: sample values illustrate received, consumed, and adjusted stock across seven days.',
};

const InventoryMovementEChart = lazy(
  () => import('./InventoryMovementEChart'),
);

export function InventoryMovementChart({
  movement,
  periodLabel,
}: InventoryMovementChartProps) {
  const isPreview = movement.status !== 'ready';
  const displayedMovement = isPreview
    ? previewMovement
    : movement;

  return (
    <section className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Inventory Movement
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Stock received, consumed, and adjusted · {periodLabel}
          </p>
        </div>
        <div className="hidden flex-col items-end gap-2 sm:flex">
          {isPreview && (
            <span className="rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warning">
              Preview data
            </span>
          )}
          <div className="flex flex-wrap justify-end gap-3 text-[11px] font-medium">
            <ChartLegend color="bg-brand-default" label="Received" />
            <ChartLegend color="bg-danger" label="Consumed" />
            <ChartLegend color="bg-warning" label="Adjusted" />
          </div>
        </div>
      </div>

      {isPreview && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5 text-xs leading-5 text-text-secondary sm:hidden">
          <FiBarChart2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-warning"
          />
          <p>
            <span className="font-semibold text-warning">Preview data.</span>{' '}
            Sample values are shown for layout only.
          </p>
        </div>
      )}

      <div className="mt-5 flex-1">
        <Suspense
          fallback={
            <div
              role="status"
              className="grid h-[280px] place-items-center text-sm text-text-secondary"
            >
              Preparing movement chart…
            </div>
          }
        >
          <InventoryMovementEChart movement={displayedMovement} />
        </Suspense>
        <p className="mt-3 text-xs leading-5 text-text-secondary">
          {displayedMovement.textSummary}
        </p>
      </div>

      <p className="sr-only">
        {displayedMovement.textSummary}
      </p>
    </section>
  );
}

function ChartLegend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-text-primary">
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-sm ${color}`}
      />
      {label}
    </span>
  );
}
