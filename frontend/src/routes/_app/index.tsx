import { createFileRoute } from '@tanstack/react-router';
import { dashboardRepository } from '../../features/dashboard/api';
import { DashboardPage } from '../../features/dashboard/components/DashboardPage';
import { buildDashboardViewModel } from '../../features/dashboard/utils/buildDashboardViewModel';
import { onboardingRepository } from '../../features/onboarding/api';

export const Route = createFileRoute('/_app/')({
  loader: async () => {
    const [overview, workspace] = await Promise.all([
      dashboardRepository.getOverview(),
      onboardingRepository.getState(),
    ]);

    return buildDashboardViewModel(
      overview,
      workspace,
    );
  },
  component: DashboardRoute,
});

function DashboardRoute() {
  const dashboard = Route.useLoaderData();

  return <DashboardPage dashboard={dashboard} />;
}
