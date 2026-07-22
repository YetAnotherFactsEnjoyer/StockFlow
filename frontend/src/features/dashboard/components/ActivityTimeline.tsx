import type {
  IconType,
} from 'react-icons';
import {
  FiAlertTriangle,
  FiArrowDown,
  FiArrowUp,
  FiEdit3,
  FiLink,
  FiPackage,
  FiShoppingBag,
} from 'react-icons/fi';

import type {
  DashboardActivityItem,
  DashboardActivityType,
} from '../types/dashboardViewModel';

interface ActivityTimelineProps {
  activities: DashboardActivityItem[];
  periodLabel: string;
  onNavigate: (route: '/products') => void;
}

const activityIcons: Record<
  DashboardActivityType,
  IconType
> = {
  product_created: FiPackage,
  supplier_linked: FiLink,
  customer_linked: FiLink,
  stock_received: FiArrowDown,
  stock_consumed: FiArrowUp,
  stock_adjusted: FiEdit3,
  low_stock: FiAlertTriangle,
  purchase_order_received: FiShoppingBag,
};

interface ActivityGroup {
  date: string;
  items: DashboardActivityItem[];
}

export function ActivityTimeline({
  activities,
  periodLabel,
  onNavigate,
}: ActivityTimelineProps) {
  const groups = groupActivities(activities);

  return (
    <section className="pt-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">
            Activity Audit
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Operational events · {periodLabel} · most recent first
          </p>
        </div>
        <span
          aria-live="polite"
          className="text-xs font-semibold text-text-secondary"
        >
          {activities.length} {activities.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border-subtle bg-surface p-7 text-center">
          <h3 className="font-semibold text-text-primary">
            No operational activity yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Product creation and future stock events will appear here as they are recorded.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-8">
          {groups.map((group) => (
            <div key={group.date}>
              <h3 className="mb-4 pl-8 text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {group.date}
              </h3>
              <ol className="relative ml-3.5 space-y-6 border-l border-border-subtle">
                {group.items.map((activity) => {
                  const Icon = activityIcons[activity.type];

                  return (
                    <li
                      key={activity.id}
                      className="group relative pl-6 sm:pl-8"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-border-subtle bg-surface transition-colors group-hover:border-brand-default/60"
                      />

                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start sm:gap-6">
                        <div className="flex items-start gap-3">
                          <Icon
                            aria-hidden="true"
                            className={`mt-0.5 size-4 shrink-0 ${activity.type === 'low_stock' ? 'text-warning' : 'text-text-secondary'}`}
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-text-primary">
                              {activity.title}
                            </h4>
                            <p className="mt-0.5 text-sm leading-5 text-text-secondary">
                              {activity.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-3 pl-7 sm:flex-col sm:items-end sm:pl-0">
                          <time
                            dateTime={activity.occurredAt}
                            className="text-xs font-medium text-text-secondary/80"
                          >
                            {formatTime(activity.occurredAt)}
                          </time>
                          {activity.route && (
                            <button
                              type="button"
                              onClick={() =>
                                activity.route &&
                                onNavigate(activity.route)
                              }
                              className="rounded text-xs font-semibold text-brand-default outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-default/30"
                            >
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function groupActivities(
  activities: DashboardActivityItem[],
) {
  return activities.reduce<ActivityGroup[]>(
    (groups, activity) => {
      const date = formatGroupDate(activity.occurredAt);
      const currentGroup = groups.at(-1);

      if (currentGroup?.date === date) {
        currentGroup.items.push(activity);
      } else {
        groups.push({
          date,
          items: [activity],
        });
      }

      return groups;
    },
    [],
  );
}

function formatGroupDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}
