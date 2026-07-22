import {
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  FiArrowRight,
} from 'react-icons/fi';

import type {
  DashboardAttentionItem as DashboardAttentionItemView,
} from '../types/dashboardViewModel';

interface AttentionItemProps {
  item: DashboardAttentionItemView;
  index: number;
  onAction: () => void;
}

const toneClasses = {
  critical: {
    badge: 'bg-danger/10 text-danger',
    rail: 'bg-danger',
  },
  warning: {
    badge: 'bg-warning/10 text-warning',
    rail: 'bg-warning',
  },
  information: {
    badge: 'bg-surface-secondary text-text-secondary',
    rail: 'bg-text-secondary',
  },
} as const;

export function AttentionItem({
  item,
  index,
  onAction,
}: AttentionItemProps) {
  const reduceMotion = useReducedMotion();
  const tones = toneClasses[item.severity];
  const primaryMetadata = item.metadata[0];
  const separatorIndex = primaryMetadata?.indexOf(':') ?? -1;
  const metricLabel =
    separatorIndex >= 0
      ? primaryMetadata.slice(0, separatorIndex)
      : null;
  const metricValue =
    separatorIndex >= 0
      ? primaryMetadata.slice(separatorIndex + 1).trim()
      : primaryMetadata;

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.22,
        delay: reduceMotion ? 0 : index * 0.035,
      }}
      className={`group relative flex min-h-[5rem] items-stretch border-t border-border-subtle first:border-t-0 ${item.severity === 'critical' && index === 0 ? 'bg-danger/5' : 'bg-transparent'} transition-colors hover:bg-surface-secondary/70`}
    >
      <div
        aria-hidden="true"
        className={`w-1 shrink-0 ${tones.rail}`}
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 sm:pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tones.badge}`}
            >
              {item.severityLabel}
            </span>
            <h3 className="text-sm font-semibold text-text-primary">
              {item.title}
            </h3>
          </div>
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            {item.description}
          </p>
          {item.metadata.length > 1 && (
            <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-text-secondary">
            {item.metadata.slice(1).map((value) => (
              <li key={value}>{value}</li>
            ))}
            </ul>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
          {metricValue && (
            <div className="text-left sm:text-right">
              <p className="text-lg font-semibold leading-tight text-text-primary">
                {metricValue}
              </p>
              {metricLabel && (
                <p className="mt-0.5 text-xs text-text-secondary">
                  {metricLabel}
                </p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md text-sm font-semibold text-brand-default outline-none transition hover:text-brand-hover focus-visible:ring-2 focus-visible:ring-brand-default/30"
          >
            {item.actionLabel}
            <FiArrowRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
