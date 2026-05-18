import ProductsPage from './pages/ProductsPage';
import SupplierPage from './pages/SupplierPage';

function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_34%),radial-gradient(circle_at_80%_0%,#0891b233,transparent_28%),#050505] text-neutral-100">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      <div className="relative border-b border-white/10 bg-neutral-950/70 backdrop-blur-xl">
        <header className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              StockFlow
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
              Inventory workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-400">
              A sharper operating room for products, suppliers, and stock signals.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
            Live operations view
          </div>
        </header>
      </div>

      <main className="relative mx-auto max-w-7xl space-y-12 px-6 py-10 md:px-8">
        <ProductsPage />
        <SupplierPage />
      </main>
    </div>
  );
}

export default App;
