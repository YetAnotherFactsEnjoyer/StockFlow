import {
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

function RootComponent() {
  return (
    <>
      <Outlet />

      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

function NotFoundComponent() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>The requested StockFlow page does not exist.</p>
    </main>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
