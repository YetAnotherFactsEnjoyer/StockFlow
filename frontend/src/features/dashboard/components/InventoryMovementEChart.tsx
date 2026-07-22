import {
  LineChart,
} from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type {
  EChartsCoreOption,
} from 'echarts/core';
import {
  CanvasRenderer,
} from 'echarts/renderers';
import {
  useReducedMotion,
} from 'motion/react';
import {
  useEffect,
  useMemo,
  useRef,
} from 'react';

import type {
  DashboardMovementViewModel,
} from '../types/dashboardViewModel';

echarts.use([
  LineChart,
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface InventoryMovementEChartProps {
  movement: DashboardMovementViewModel;
}

export default function InventoryMovementEChart({
  movement,
}: InventoryMovementEChartProps) {
  const reduceMotion = useReducedMotion();
  const chartContainerRef =
    useRef<HTMLDivElement>(null);
  const option = useMemo<EChartsCoreOption>(
    () => ({
      animation: !reduceMotion,
      animationDuration: reduceMotion ? 0 : 250,
      aria: {
        enabled: true,
        description: movement.textSummary,
      },
      color: ['#4f46e5', '#dc6672', '#b7791f'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#172033',
        borderWidth: 0,
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
        },
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        itemHeight: 8,
        itemWidth: 8,
        textStyle: {
          color: '#98a2b3',
          fontSize: 11,
        },
      },
      grid: {
        top: 16,
        right: 12,
        bottom: 48,
        left: 48,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: movement.points.map((point) => point.label),
        axisLine: {
          lineStyle: { color: '#d8dee8' },
        },
        axisTick: { show: false },
        axisLabel: { color: '#98a2b3' },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#98a2b3' },
        splitLine: {
          lineStyle: {
            color: '#d8dee8',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          name: 'Received',
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
          data: movement.points.map(
            (point) => point.received,
          ),
        },
        {
          name: 'Consumed',
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
          data: movement.points.map(
            (point) => point.consumed,
          ),
        },
        {
          name: 'Adjusted',
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
          data: movement.points.map(
            (point) => point.adjusted,
          ),
        },
      ],
    }),
    [movement, reduceMotion],
  );

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) {
      return;
    }

    const chart = echarts.init(container);
    chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [option]);

  return (
    <div
      ref={chartContainerRef}
      role="img"
      aria-label={movement.textSummary}
      className="h-[280px] w-full"
    />
  );
}
