import type { FC, ReactElement } from 'react';

export type UsePerfMetric = (settings?: PerfMetricSettings) => PerfMetricReturn;

export type PerfMetricSettings = MeasurePerformanceSettings & { measureFromCreated?: boolean };

export type MeasurePerformanceSettings = (
  | {
      measureAtEffectStage?: false;
    }
  | { measureAtEffectStage: true; callback: EffectCallback }
) & {
  id?: string;
};

export type EffectCallback = (() => void) | null;

export interface PerfMetricReturn {
  WrapMetricConsumer: FC<WrapMetricConsumerProps>;

  measurePerformance: MeasurePerformance;
}

export type MeasurePerformance = (settings?: MeasurePerformanceSettings) => void;

export type MetricConsumerProps =
  | { status: 'never' | 'pending'; data?: null }
  | { status: 'error'; data?: null; error: Error }
  | { status: 'done'; data: PerfMetric };

export interface PerfMetric {
  TTI: number;

  TBT: number;
}
export interface WrapMetricConsumerProps {
  children: ReactElement<MetricConsumerProps>;
}

export type MeasurementStatus = 'never' | 'pending' | 'done' | 'error';

export type PerfEventsType = 'longtask' | 'mark';
