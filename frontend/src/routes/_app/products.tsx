import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/products')({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Inventory</p>
          <h1>Products</h1>
        </div>
      </header>

      <div className="placeholder-card">
        <h2>Product management</h2>
        <p>
          The product list and product actions will be implemented here.
        </p>
      </div>
    </section>
  );
}
