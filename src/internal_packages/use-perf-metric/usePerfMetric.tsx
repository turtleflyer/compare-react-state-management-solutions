import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { FC } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { createObserverCallback } from './createObserverCallback';
import type {
  EffectCallback,
  MeasurementStatus,
  MeasurePerformance,
  MeasurePerformanceSettings,
  MetricConsumerProps,
  PerfMetric,
  PerfMetricReturn,
  PerfMetricSettings,
  UsePerfMetric,
  WrapMetricConsumerProps,
} from './PerfMetricTypes';

const defSettings: Required<PerfMetricSettings> = {
  measureFromCreated: false,
  measureAtEffectStage: false,
  id: 'start-use-perf-metrics',
};

const initialStatus: MetricConsumerProps & { status: 'never' } = { status: 'never', data: null };

const pendingStatus: MetricConsumerProps & { status: 'pending' } = {
  status: 'pending',
  data: null,
};

const errorStatus: Omit<MetricConsumerProps & { status: 'error' }, 'error'> = {
  status: 'error',
};

const errorDoesNotSupport = Error('(usePerfMetrics) The browser does not support the library');

const createUsePerfMetricReturn = (
  settings: PerfMetricSettings
): { perfMetricReturn: PerfMetricReturn; useBody: () => void } => {
  const { supportedEntryTypes = null } = global.PerformanceObserver ?? null;

  const isSupported =
    supportedEntryTypes &&
    supportedEntryTypes.includes('mark') &&
    supportedEntryTypes.includes('longtask');

  const actualSettings = { ...defSettings, ...eliminateUndefinedRecords(settings) };
  const { measureFromCreated, id: mainDefinedID } = actualSettings;
  let isFirstRun = true;
  let useEffectRegistered = false;

  /**
   * While WrapMetric is rendering first time its child component receives status ('pending' if
   * measureFromCreated set true and 'never' otherwise) at useState stage. In order to avoid
   * increasing complexity variable setChildrenProps holds the placeholder function that could be
   * called with no side effect at the same stage when useState in WrapMetrics returns props for
   * the child. Later setChildrenProps holds the method that is a setter returned from that useState
   * responsible for updating MetricConsumer's props.
   */
  let setChildrenProps: (result: MetricConsumerProps) => void = () => undefined;
  let startOnEffect: (() => void) | null = null;

  const useBody = (): void => {
    useEffect(() => {
      useEffectRegistered = true;
    }, []);
  };

  const postErrorStatus = (error: Error): void => setChildrenProps({ ...errorStatus, error });

  const postCalculatedData = (result: PerfMetric): void =>
    setChildrenProps({ status: 'done', data: result });

  const isFirstRunOrUseEffectRegistered = (): boolean => {
    const result = isFirstRun || useEffectRegistered;
    isFirstRun = false;

    return result;
  };

  const measurePerformance = (measureSettings: MeasurePerformanceSettings = {}) => {
    const { id } = { id: mainDefinedID, ...measureSettings };
    const perfMarkName = getNextKey(id);

    const observer =
      isSupported &&
      new PerformanceObserver(
        createObserverCallback(
          perfMarkName,
          postErrorStatus,
          postCalculatedData,
          isFirstRunOrUseEffectRegistered
        )
      );

    isSupported && setChildrenProps(pendingStatus);

    measureSettings.measureAtEffectStage
      ? (startOnEffect = () => {
          startMeasurement();
          measureSettings.callback?.();
        })
      : startMeasurement();

    function startMeasurement() {
      if (observer) {
        observer.observe({ entryTypes: ['mark', 'longtask'] });
        performance.mark(perfMarkName);
      }
    }
  };

  const WrapMetricConsumer: FC<WrapMetricConsumerProps> = ({ children: nestedComponent }) => {
    const [childrenProps, _setChildrenProps] = useState((): MetricConsumerProps => {
      if (isSupported) {
        if (measureFromCreated) {
          measurePerformance(actualSettings);

          return pendingStatus;
        }

        return initialStatus;
      }

      return { ...errorStatus, error: errorDoesNotSupport };
    });

    setChildrenProps = _setChildrenProps;

    useEffect(() => {
      if (startOnEffect) {
        startOnEffect();
        startOnEffect = null;
      }
    });

    useEffect(
      () => () => {
        setChildrenProps = () => undefined;
      },
      []
    );

    return cloneElement(nestedComponent, childrenProps);
  };

  const perfMetricReturn = { WrapMetricConsumer, measurePerformance };

  return { perfMetricReturn, useBody };
};

type OnlyDefinedRecords<O> = O extends {} ? { [P in keyof O]-?: O[P] } : never;

export const usePerfMetric = ((settings: PerfMetricSettings = {}): PerfMetricReturn => {
  const [{ perfMetricReturn, useBody }] = useState(() => createUsePerfMetricReturn(settings));
  useBody();

  return perfMetricReturn;
}) as UsePerfMetric;

function eliminateUndefinedRecords<O extends {}>(obj: O): OnlyDefinedRecords<O> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, val]) => val !== undefined)
  ) as OnlyDefinedRecords<O>;
}

export type {
  PerfMetric,
  MeasurementStatus,
  MetricConsumerProps,
  PerfMetricReturn,
  PerfMetricSettings,
  MeasurePerformanceSettings,
  EffectCallback,
  MeasurePerformance,
  WrapMetricConsumerProps,
};
