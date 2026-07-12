import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          StockFlow
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Dashboard
        </h1>

        <div className="mt-8 rounded-card border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Tailwind is working
          </h2>

          <p className="mt-2 text-slate-500">
            The StockFlow design foundation is ready.
          </p>

          <button
            type="button"
            className="mt-6 rounded-control bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Continue setup
          </button>
        </div>
      </section>
    </main>
  );
}
