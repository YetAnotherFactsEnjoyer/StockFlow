import {
  motion,
  useReducedMotion,
} from 'motion/react';
import {
  useState,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';

import type {
  DashboardPeriod,
  DashboardViewModel,
} from '../types/dashboardViewModel';
import {
  ActivityTimeline,
} from './ActivityTimeline';
import {
  AttentionQueue,
} from './AttentionQueue';
import {
  DashboardEmptyState,
} from './DashboardEmptyState';
import {
  DashboardHeader,
} from './DashboardHeader';
import {
  DashboardInsights,
} from './DashboardInsights';
import {
  InventoryMovementChart,
} from './InventoryMovementChart';
import {
  InventoryPulse,
} from './InventoryPulse';
import {
  InventoryRiskSummary,
} from './InventoryRiskSummary';
import {
  StockFlowSummary,
} from './StockFlowSummary';
import {
  UpcomingDeliveries,
} from './UpcomingDeliveries';

interface DashboardPageProps {
  dashboard: DashboardViewModel;
}

export function DashboardPage({
  dashboard,
}: DashboardPageProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [selectedPeriod, setSelectedPeriod] =
    useState<DashboardPeriod>('7d');
  const currentPeriod = dashboard.periods.find(
    (period) => period.id === selectedPeriod,
  ) ?? dashboard.periods[0];
  const currentData = dashboard.periodData[selectedPeriod];

  function navigateToProducts() {
    void navigate({
      to: '/products',
      search: {},
    });
  }

  function handleAddProduct() {
    void navigate({
      to: '/products/new',
    });
  }

  const periodTransition = {
    duration: reduceMotion ? 0 : 0.22,
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 pb-12 sm:p-6 sm:pb-12 lg:p-8 lg:pb-12">
      <DashboardHeader
        header={dashboard.header}
        periods={dashboard.periods}
        selectedPeriod={selectedPeriod}
        showAddProduct={dashboard.state === 'ready'}
        onPeriodChange={setSelectedPeriod}
        onAddProduct={handleAddProduct}
      />

      {dashboard.state === 'empty' ? (
        <DashboardEmptyState
          onAddProduct={handleAddProduct}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch xl:gap-8">
          <div className="lg:col-span-8 lg:col-start-5 lg:row-start-1 xl:col-span-8">
            <AttentionQueue
              attention={dashboard.attention}
              onReviewProduct={navigateToProducts}
              onReviewAll={navigateToProducts}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1 xl:col-span-4">
            <InventoryPulse pulse={dashboard.pulse} />
          </div>

          <div className="lg:col-span-12 lg:row-start-2">
            <StockFlowSummary
              segments={dashboard.stockFlow}
              onNavigate={navigateToProducts}
            />
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:row-start-3">
            <InventoryRiskSummary risk={dashboard.risk} />
          </div>

          <div className="lg:col-span-8 lg:col-start-1 lg:row-start-4">
            <DashboardInsights insights={dashboard.insights} />
          </div>

          <motion.div
            key={`movement-${selectedPeriod}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={periodTransition}
            className="lg:col-span-8 lg:col-start-1 lg:row-start-3"
          >
            <InventoryMovementChart
              movement={currentData.movement}
              periodLabel={currentPeriod.label}
            />
          </motion.div>

          <div className="lg:col-span-4 lg:col-start-9 lg:row-start-4">
            <UpcomingDeliveries deliveries={dashboard.deliveries} />
          </div>

          <motion.div
            key={`activity-${selectedPeriod}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={periodTransition}
            className="lg:col-span-12 lg:row-start-5"
          >
            <ActivityTimeline
              activities={currentData.activities}
              periodLabel={currentPeriod.label}
              onNavigate={navigateToProducts}
            />
          </motion.div>
        </div>
      )}
    </main>
  );
}
