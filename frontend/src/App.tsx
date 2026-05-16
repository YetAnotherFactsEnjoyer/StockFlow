import ProductsPage from './pages/ProductsPage';
import SupplierPage from './pages/SupplierPage';

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="border-b border-neutral-800 bg-neutral-950/95">
        <header className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              StockFlow
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Inventory workspace</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live operations view
          </div>
        </header>
      </div>

      <main className="mx-auto max-w-7xl space-y-8 px-6 py-8 md:px-8">
        <ProductsPage />
        <SupplierPage />
      </main>
    </div>
  );
}

export default App;
