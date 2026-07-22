import { Link, useNavigate } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import type { IconType } from 'react-icons';
import {
  FiBox,
  FiGrid,
  FiMoreHorizontal,
  FiPackage,
  FiSearch,
  FiSettings,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';

import { onboardingRepository } from '../features/onboarding/api';
import { useOnboarding } from '../features/onboarding/context/useOnboarding';

const navigation: Array<{
  label: string;
  to: '/' | '/products' | '/suppliers';
  icon: IconType;
  exact?: boolean;
}> = [
  { label: 'Overview', to: '/', icon: FiGrid, exact: true },
  { label: 'Products', to: '/products', icon: FiPackage },
  { label: 'Suppliers', to: '/suppliers', icon: FiTruck },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { state, dispatch } = useOnboarding();
  const workspaceName = state.branding.applicationName || state.organization.name || 'StockFlow';
  const memberCount = state.teamMembers.length + 1;
  const initials = workspaceName.trim().slice(0, 2).toUpperCase() || 'SF';

  async function handleTestSetup() {
    await onboardingRepository.reset();
    dispatch({ type: 'RESET' });
    await navigate({ to: '/setup' });
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-4 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-default text-xs font-black tracking-tight text-white">
            SF
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-text-primary">
              StockFlow
            </p>
            <p className="truncate text-[11px] text-text-secondary">
              {workspaceName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleTestSetup()}
          className="grid size-10 place-items-center rounded-xl text-text-secondary outline-none hover:bg-surface-secondary hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand-default/30"
          aria-label="Test workspace setup"
        >
          <FiSettings aria-hidden="true" className="size-5" />
        </button>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid h-20 grid-cols-3 border-t border-border-subtle bg-surface px-2 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navigation.map(({ label, to, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            className="relative flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-text-secondary outline-none transition-colors duration-200 hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-brand-default/30"
            activeProps={{
              className:
                'relative flex flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-brand-default outline-none',
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="mobile-navigation-active"
                    className="absolute inset-1 rounded-xl bg-brand-soft"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
                  />
                )}
                <Icon aria-hidden="true" className="relative size-5" />
                <span className="relative">{label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>

      <aside
        className="sticky left-0 top-0 z-10 hidden h-screen w-[280px] shrink-0 flex-col overflow-hidden border-r border-border-subtle bg-surface px-4 py-5 text-text-secondary md:flex"
      >
      <div className="mb-6 flex min-h-12 items-center gap-3 px-2">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-default text-sm font-black tracking-tight text-white">SF</span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold tracking-tight text-text-primary">StockFlow</p>
          <p className="truncate text-xs font-medium text-text-secondary">{workspaceName}</p>
        </div>
      </div>

      <label className="relative mb-7 block px-2">
        <span className="sr-only">Search inventory</span>
        <FiSearch className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
        <input type="search" placeholder="Search" className="w-full rounded-xl border border-border-subtle bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-brand-default/50 focus:ring-2 focus:ring-brand-default/20" />
      </label>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
      <nav aria-label="Main navigation" className="flex w-full flex-col gap-1.5">
        {navigation.map(({ label, to, icon: Icon, exact }) => (
          <Link key={to} to={to} activeOptions={{ exact }} className="group relative flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-text-secondary transition-colors duration-200 hover:bg-surface-secondary hover:text-text-primary" activeProps={{ className: 'group relative flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-semibold text-brand-default' }}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="desktop-navigation-active"
                    className="absolute inset-0 rounded-xl bg-brand-soft"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
                  >
                    <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-default" />
                  </motion.span>
                )}
                <span className={['relative flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200', isActive ? 'bg-brand-default text-white' : 'bg-surface-secondary text-text-secondary group-hover:text-text-primary'].join(' ')}>
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="relative min-w-0 flex-1 truncate">{label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="my-6 h-px bg-border-subtle" />
      <section className="px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Workspace</p>
        <div className="mt-4 space-y-1">
          <InfoRow icon={FiBox} label="Inventory" value={state.inventory.locationsEnabled ? 'Multi-site' : 'Single site'} />
          <InfoRow icon={FiUsers} label="Team" value={`${memberCount}`} />
        </div>
      </section>

      <button
        type="button"
        onClick={() => void handleTestSetup()}
        className="mt-5 flex min-h-11 w-full items-center gap-3 rounded-xl border border-border-subtle px-3 text-left text-sm font-semibold text-text-secondary transition hover:border-brand-default/40 hover:bg-brand-soft hover:text-brand-default"
      >
        <FiSettings className="size-[18px] shrink-0 text-brand-default" />
        Test setup
      </button>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-secondary p-3 transition hover:border-brand-default/30">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-default text-sm font-bold text-white">{initials}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{workspaceName}</p>
            <p className="truncate text-xs text-text-secondary">Workspace admin</p>
          </div>
        </div>
        <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary" aria-label="Workspace options"><FiMoreHorizontal className="size-5" /></button>
      </div>
      </aside>
    </>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-2 rounded-xl px-1 py-2 text-sm">
      <span className="flex min-w-0 items-center gap-3"><Icon className="size-4 shrink-0 text-text-secondary" /><span className="truncate">{label}</span></span>
      <span className="shrink-0 rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-semibold text-text-secondary">{value}</span>
    </div>
  );
}
