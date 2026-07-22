import {
  FiArchive,
  FiCalendar,
} from 'react-icons/fi';

import type {
  DashboardDeliveriesViewModel,
} from '../types/dashboardViewModel';

interface UpcomingDeliveriesProps {
  deliveries: DashboardDeliveriesViewModel;
}

const statusClasses = {
  today: 'text-success',
  upcoming: 'text-brand-default',
  late: 'text-danger',
} as const;

export function UpcomingDeliveries({
  deliveries,
}: UpcomingDeliveriesProps) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-text-primary">
          Upcoming Deliveries
        </h2>
        {deliveries.items.length > 0 && (
          <span className="text-xs font-medium text-text-secondary">
            {deliveries.items.length} expected
          </span>
        )}
      </div>

      {deliveries.status === 'ready' ? (
        <div className="mt-5 space-y-5">
          {deliveries.items.map((delivery) => (
            <article
              key={delivery.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-text-primary">
                  {delivery.supplierName}
                </h3>
                <p className="mt-0.5 truncate text-xs text-text-secondary">
                  {delivery.reference} · {delivery.quantitySummary}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="flex items-center justify-end gap-1.5 text-sm text-text-primary">
                  <FiCalendar
                    aria-hidden="true"
                    className="size-3.5 text-text-secondary"
                  />
                  {delivery.expectedDate}
                </p>
                <p
                  className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${statusClasses[delivery.status]}`}
                >
                  {delivery.status}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-surface-secondary text-text-secondary/70">
            <FiArchive aria-hidden="true" className="size-5" />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-text-primary">
            No pending arrivals
          </h3>
          <p className="mt-2 max-w-xs text-xs leading-5 text-text-secondary">
            Purchase orders and expected deliveries will appear once procurement is configured.
          </p>
        </div>
      )}
    </section>
  );
}
