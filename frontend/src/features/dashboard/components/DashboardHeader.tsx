import {
  FiChevronDown,
  FiPlus,
} from 'react-icons/fi';

import {
  Button,
} from '../../../shared/components/Button';
import type {
  DashboardPeriod,
  DashboardPeriodOption,
  DashboardViewModel,
} from '../types/dashboardViewModel';

interface DashboardHeaderProps {
  header: DashboardViewModel['header'];
  periods: DashboardPeriodOption[];
  selectedPeriod: DashboardPeriod;
  showAddProduct: boolean;
  onPeriodChange: (period: DashboardPeriod) => void;
  onAddProduct: () => void;
}

export function DashboardHeader({
  header,
  periods,
  selectedPeriod,
  showAddProduct,
  onPeriodChange,
  onAddProduct,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border-subtle pb-4 pt-1">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {header.title}
          </h1>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {header.summary}
          </p>
          {header.updatedLabel && (
            <p className="mt-1 text-xs font-medium text-text-secondary/80">
              {header.eyebrow} · {header.updatedLabel}
            </p>
          )}
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <label className="relative block min-w-0 flex-1 md:flex-none">
            <span className="sr-only">Reporting period</span>
            <select
              value={selectedPeriod}
              onChange={(event) =>
                onPeriodChange(
                  event.currentTarget.value as DashboardPeriod,
                )
              }
              className="min-h-10 w-full min-w-40 appearance-none rounded-lg border border-border-subtle bg-surface-secondary py-2 pl-3 pr-9 text-sm font-semibold text-text-primary outline-none transition hover:bg-surface focus:border-brand-default focus:ring-2 focus:ring-brand-default/20"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
            />
          </label>

          {showAddProduct && (
            <Button
              size="small"
              className="shrink-0 rounded-lg"
              leftIcon={<FiPlus className="size-4" />}
              onClick={onAddProduct}
            >
              Add product
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
