import React, { useRef, useState } from 'react';
import { MeasureComponent } from './MeasureComponent';
import type {
  Measures,
  MetricsComponentProps,
  StartMeasure,
  Status,
  UsePerfMetricsReturn,
  UsePerfMetricsSettings,
  WrapMetricsComponentChildren,
} from './PerfMetricsTypes';

const defSettings: UsePerfMetricsSettings = {
  measureFromCreating: false,
};

export function usePerfObserver(
  settings: Partial<UsePerfMetricsSettings> = {}
): UsePerfMetricsReturn {
  const actualSettings = { ...defSettings, ...settings };
  const startMeasureRec = useRef<StartMeasure>(() => undefined);

  const [usePerfObserverReturn] = useState<UsePerfMetricsReturn>([
    function WrapMetrics({ children }: WrapMetricsComponentChildren) {
      return (
        <MeasureComponent
          {...{
            settings: actualSettings,
            updateStartMeasureCallback: (startMeasureCallback) => {
              startMeasureRec.current = startMeasureCallback;
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

export type { Measures, Status, MetricsComponentProps, UsePerfMetricsReturn };
