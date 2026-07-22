import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  useId,
  useState,
} from 'react';
import {
  FiChevronDown,
} from 'react-icons/fi';

import type {
  InventoryPulseViewModel,
} from '../types/dashboardViewModel';

interface InventoryPulseProps {
  pulse: InventoryPulseViewModel | null;
}

const statusClasses = {
  healthy: {
    text: 'text-success',
    stroke: 'stroke-success',
  },
  stable: {
    text: 'text-brand-default',
    stroke: 'stroke-brand-default',
  },
  at_risk: {
    text: 'text-warning',
    stroke: 'stroke-warning',
  },
} as const;

export function InventoryPulse({
  pulse,
}: InventoryPulseProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const reduceMotion = useReducedMotion();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  if (!pulse) {
    return (
      <section className="flex h-full flex-col rounded-xl border border-border-subtle bg-surface p-5">
        <h2 className="text-sm font-semibold text-text-primary">
          Inventory Pulse
        </h2>
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="grid size-24 place-items-center rounded-full border-[6px] border-surface-secondary text-sm font-semibold text-text-secondary">
            — / 100
          </div>
          <h3 className="mt-5 font-semibold text-text-primary">
            Pulse is not available yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Activate at least one product to calculate inventory health.
          </p>
        </div>
      </section>
    );
  }

  const rankedFactors = [...pulse.factors].sort(
    (first, second) =>
      second.score / second.maximum -
      first.score / first.maximum,
  );
  const strongestFactor = rankedFactors[0];
  const weakestFactor = rankedFactors.at(-1);
  const offset =
    circumference -
    (pulse.score / 100) * circumference;
  const tones = statusClasses[pulse.status];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-surface p-5">
      <h2 className="text-sm font-semibold text-text-primary">
        Inventory Pulse
      </h2>

      <div className="mt-5 flex items-center gap-5">
        <div
          role="progressbar"
          aria-label="Inventory Pulse score"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pulse.score}
          className="relative grid size-24 shrink-0 place-items-center"
        >
          <svg
            aria-hidden="true"
            className="size-24 -rotate-90"
            viewBox="0 0 96 96"
          >
            <circle
              className="stroke-surface-secondary"
              strokeWidth="6"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
            <motion.circle
              className={tones.stroke}
              strokeWidth="6"
              strokeDasharray={circumference}
              initial={
                reduceMotion
                  ? false
                  : { strokeDashoffset: circumference }
              }
              animate={{ strokeDashoffset: offset }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                ease: 'easeOut',
              }}
              strokeLinecap="round"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
          </svg>
          <div className="absolute text-center">
            <span className="block text-2xl font-bold leading-none text-text-primary">
              {pulse.score}
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              / 100
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <p className={`text-lg font-semibold ${tones.text}`}>
            {pulse.statusLabel}
          </p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Overall health based on availability, stock exposure, supplier coverage, and catalog readiness.
          </p>
        </div>
      </div>

      <div className="mt-6 flex-1">
        <AnimatePresence initial={false} mode="wait">
          {expanded ? (
            <motion.div
              key="all-factors"
              id={detailsId}
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="space-y-3 border-t border-border-subtle pt-4"
            >
              {pulse.factors.map((factor) => (
                <div
                  key={factor.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary">
                      {factor.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-text-secondary">
                      {factor.explanation}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-text-primary">
                    {factor.score} / {factor.maximum}
                  </span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="factor-summary"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="space-y-3"
            >
              {strongestFactor && (
                <FactorSummary
                  label="Strongest"
                  factor={strongestFactor}
                  tone="positive"
                />
              )}
              {weakestFactor &&
                weakestFactor.id !== strongestFactor?.id && (
                  <FactorSummary
                    label="Watch"
                    factor={weakestFactor}
                    tone="warning"
                  />
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={() => setExpanded((current) => !current)}
        className="mt-4 inline-flex min-h-9 w-fit items-center gap-1.5 rounded-md text-xs font-semibold text-text-secondary outline-none transition hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand-default/30 focus-visible:ring-offset-2"
      >
        {expanded ? 'Hide calculation details' : 'View all factors'}
        <FiChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </section>
  );
}

function FactorSummary({
  label,
  factor,
  tone,
}: {
  label: string;
  factor: InventoryPulseViewModel['factors'][number];
  tone: 'positive' | 'warning';
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="min-w-0">
        <span className="mr-2 text-[10px] font-bold uppercase tracking-wide text-text-secondary">
          {label}
        </span>
        <span className="text-text-secondary">
          {factor.label}
        </span>
      </div>
      <span
        className={`shrink-0 font-semibold ${tone === 'positive' ? 'text-success' : 'text-warning'}`}
      >
        {factor.score} / {factor.maximum}
      </span>
    </div>
  );
}
