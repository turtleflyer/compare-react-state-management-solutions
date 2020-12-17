/* eslint-disable react-hooks/exhaustive-deps */
import { getNextKey } from '@~internal/get-next-key';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { createObserver } from './createObserver';
import type {
  CreateObserverResult,
  MetricsComponentProps,
  UsePerfMetricsSettings,
  WrapMetricsComponentChildren,
} from './PerfMetricsTypes';

const { supportedEntryTypes } = PerformanceObserver;
const isSupported =
  supportedEntryTypes &&
  supportedEntryTypes.includes('mark') &&
  supportedEntryTypes.includes('longtask');

function isCreateObserverResultValid(r: CreateObserverResult | null): r is CreateObserverResult {
  return isSupported;
}

export const MeasureComponent: FC<
  WrapMetricsComponentChildren & {
    settings: UsePerfMetricsSettings;
    updateStartMeasureCallback: (startMeasureCallback: () => void) => void;
  }
> = ({ children: nestedComponent, settings, updateStartMeasureCallback }) => {
  const { measureFromCreating, name } = settings;

  const [perfMarkName] = useState(() => getNextKey(name ?? 'start-use-perf-metrics'));
  const [childrenProps, setChildrenProps] = useState<MetricsComponentProps>(() => {
    if (isSupported) {
      return { data: null, status: 'never' };
    }

    return {
      data: null,
      status: 'error',
      error: Error('(usePerfObserver) The browser does not support the library'),
    };
  });
  const firstTimeRunRec = useRef(true);
  const [conditionalObserverResult] = useState(() =>
    isSupported ? createObserver(perfMarkName, setChildrenProps, updateStartMeasureCallback) : null
  );

  if (
    isCreateObserverResultValid(conditionalObserverResult) &&
    firstTimeRunRec.current &&
    measureFromCreating
  ) {
    const [observer] = conditionalObserverResult;
    observer.observe({ entryTypes: ['mark', 'longtask'] });
    performance.mark(perfMarkName);
  }

  useEffect(() => {
    if (isCreateObserverResultValid(conditionalObserverResult)) {
      const [, callback] = conditionalObserverResult;
      firstTimeRunRec.current = false;

      if (measureFromCreating) {
        setChildrenProps({ status: 'pending', data: null });
      }

      return callback();
    }

    return undefined;
  }, []);

  const nestedComponentWithProps = useMemo(
    () => cloneElement(nestedComponent as ReactElement<MetricsComponentProps>, childrenProps),
    [childrenProps]
  );

  return nestedComponentWithProps;
};
