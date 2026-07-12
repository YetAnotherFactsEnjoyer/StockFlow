import type { IconType } from 'react-icons';
import {
  FiBox,
  FiCreditCard,
  FiDatabase,
  FiGlobe,
  FiLayers,
  FiPackage,
  FiUsers,
} from 'react-icons/fi';

import { useOnboarding } from '../context/useOnboarding';

const valuationLabels: Record<string, string> = {
  FIFO: 'First-In, First-Out',
  LIFO: 'Last-In, First-Out',
  AVG: 'Weighted Average Cost',
};

const importLabels: Record<string, string> = {
  MANUAL: 'Empty workspace',
  CSV: 'CSV import',
  SEED: 'Demonstration data',
};

export default function ReviewStep() {
  const { state } = useOnboarding();
  const teamSize = state.teamMembers.length + 1;
  const workspaceName =
    state.branding.applicationName || state.organization.name || 'StockFlow';

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-brand-default">Ready to ship</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Review your workspace
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          One last check before your new workspace leaves the warehouse.
        </p>
      </header>

      <article
        data-review-card
        className="mt-8 overflow-hidden rounded-[24px] border border-border-subtle bg-surface shadow-sm"
      >
        <div className="flex flex-col gap-5 bg-text-primary px-6 py-6 text-surface sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-surface text-text-primary">
              <FiPackage className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
                Workspace package
              </p>
              <h2 className="mt-1 text-xl font-bold">{workspaceName}</h2>
            </div>
          </div>
          <span className="w-fit rounded-full bg-brand-default px-3 py-1.5 text-xs font-bold text-white">
            Ready for launch
          </span>
        </div>

        <div className="grid divide-y divide-border-subtle sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="divide-y divide-border-subtle px-6 sm:px-8">
            <ReviewRow icon={FiBox} label="Organization" value={state.organization.name || 'Not configured'} />
            <ReviewRow icon={FiGlobe} label="Workspace URL" value={state.organization.slug ? `/${state.organization.slug}` : 'Not configured'} mono />
            <ReviewRow icon={FiCreditCard} label="Currency" value={state.organization.currency} />
          </div>
          <div className="divide-y divide-border-subtle px-6 sm:px-8">
            <ReviewRow icon={FiLayers} label="Valuation" value={valuationLabels[state.inventory.valuationMethod] || state.inventory.valuationMethod} />
            <ReviewRow icon={FiUsers} label="Team" value={`${teamSize} ${teamSize === 1 ? 'member' : 'members'}`} />
            <ReviewRow icon={FiDatabase} label="Initial data" value={importLabels[state.import.mode] || state.import.mode} />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border-subtle bg-surface-secondary px-6 py-4 sm:px-8">
          <div>
            <p className="text-xs font-medium text-text-secondary">Brand palette</p>
            <p className="mt-0.5 font-mono text-xs text-text-primary">{state.branding.primaryColor}</p>
          </div>
          <div className="flex -space-x-2">
            <span className="size-9 rounded-full border-2 border-surface" style={{ backgroundColor: state.branding.primaryColor }} />
            <span className="size-9 rounded-full border-2 border-surface" style={{ backgroundColor: state.branding.accentColor }} />
          </div>
        </div>
      </article>
    </div>
  );
}

function ReviewRow({ icon: Icon, label, value, mono = false }: { icon: IconType; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex min-h-20 items-center gap-3 py-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-text-secondary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium text-text-secondary">{label}</dt>
        <dd className={['mt-1 truncate text-sm font-semibold text-text-primary', mono ? 'font-mono' : ''].join(' ')}>{value}</dd>
      </div>
    </div>
  );
}
