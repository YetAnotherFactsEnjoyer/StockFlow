import {
  createFileRoute,
  Outlet,
} from '@tanstack/react-router';

import { AppLayout } from '../layouts/AppLayout';

export const Route = createFileRoute('/_app')({
  component: AppRouteComponent,
});

function AppRouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
