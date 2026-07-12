import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { StockFlowLogo } from '../shared/components/StockFlowLogo';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-[16rem_minmax(0,1fr)] bg-slate-50">
      <aside className="sticky top-0 h-screen border-r border-slate-200 bg-white px-4 py-6">
        <div className="flex items-center gap-3 px-2">
          <StockFlowLogo
            markClassName="size-10"
            wordmarkClassName="text-base"
            subtitle="Inventory Management"
            subtitleClassName="text-slate-400"
          />
        </div>

        <nav className="mt-10 grid gap-1">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            activeProps={{
              className:
                'rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700',
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            activeProps={{
              className:
                'rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700',
            }}
          >
            Products
          </Link>

          <Link
            to="/suppliers"
            className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
            activeProps={{
              className:
                'rounded-lg bg-brand-50 px-3 py-2.5 text-sm font-semibold text-brand-700',
            }}
          >
            Suppliers
          </Link>
        </nav>
      </aside>

      <main className="min-w-0">
        {children}
      </main>
    </div>
  );
}
