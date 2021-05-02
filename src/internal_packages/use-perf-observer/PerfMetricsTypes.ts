import type { FC, ReactElement } from 'react';

export type EntryType = 'longtask' | 'mark' | 'event';

export type StartMeasure = () => void;

export interface Measures {
  TTI: number;
  TBT: number;
  eventDelay?: number;
  eventDuration?: number;
}

export type Status = 'never' | 'pending' | 'done' | 'error';

export type MetricsComponentProps =
  | { status?: undefined; data?: undefined; error?: undefined }
  | { status: 'never' | 'pending'; data: null; error?: undefined }
  | { status: 'error'; data: null; error: Error }
  | { status: 'done'; data: Measures; error?: undefined };

export interface UsePerfMetricsSettings {
  measureFromCreating: boolean;
  name?: string;
}

export type UsePerfMetricsReturn = readonly [FC<WrapMetricsComponentChildren>, StartMeasure];

export type CreateObserverResult = readonly [PerformanceObserver, () => () => void];

export type WrapMetricsComponentChildren = { children: ReactElement<MetricsComponentProps> };
