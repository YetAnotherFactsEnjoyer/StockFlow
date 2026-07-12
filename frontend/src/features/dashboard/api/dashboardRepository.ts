import type { DashboardOverview } from '../types/dashboard';

export interface DashboardRepository {
  getOverview(): Promise<DashboardOverview>;
}
