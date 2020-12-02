import type { FC } from 'react';
import React, { useRef, useState } from 'react';
import { MeasureComponent } from './MeasureComponent';
import type {
  Measures,
  MetricsComponentProps,
  Status,
  UsePerfObserverSettings,
  WrapMetricsComponentChildren,
} from './PerfMetricsTypes';

const defSettings: UsePerfObserverSettings = {
  measureFromCreating: false,
};

export function usePerfObserver(
  settings: Partial<UsePerfObserverSettings> = {}
): [FC<WrapMetricsComponentChildren>, () => void] {
  const { measureFromCreating } = { ...defSettings, ...settings };
  const startMeasureRec = useRef(() => {});

  const [usePerfObserverReturn] = useState<[FC<WrapMetricsComponentChildren>, () => void]>([
    function WrapMetrics({ children }: WrapMetricsComponentChildren) {
      return (
        <MeasureComponent
          {...{
            measureFromCreating,
            updateStartMeasureCallback: (sm) => {
              startMeasureRec.current = sm;
            },
          }}
        >
          {children}
        </MeasureComponent>
      );
    },

    () => startMeasureRec.current(),
  ]);

  return usePerfObserverReturn;
}

export type { Measures, Status, MetricsComponentProps };
