import { getNextKey } from 'get-next-key';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import { createObserver } from './createObserver';
import { WrapMetricsComponentChildren } from './PerfMetricsTypes';
import { MetricsComponentProps } from './usePerfObserver';

const { supportedEntryTypes } = PerformanceObserver;
const isSupported =
  supportedEntryTypes &&
  supportedEntryTypes.includes('mark') &&
  supportedEntryTypes.includes('longtask');

export const MeasureComponent: FC<
  WrapMetricsComponentChildren & {
    measureFromCreating: boolean;
    updateStartMeasureCallback: (startMeasure: () => void) => void;
  }
> = ({ children: nestedComponent, measureFromCreating, updateStartMeasureCallback }) => {
  const [perfMarkName] = useState(() => getNextKey('start'));
  const [childrenProps, setChildrenProps] = useState<Required<MetricsComponentProps>>(() => {
    if (isSupported) {
      return { data: null, status: 'never' };
    }

    return { data: null, status: 'error' };
  });
  const firstTimeRunRec = useRef(true);

  const [conditionalObserverResult] = useState(() =>
    isSupported ? createObserver(perfMarkName, setChildrenProps, updateStartMeasureCallback) : null
  );

  if (isSupported && firstTimeRunRec.current && measureFromCreating) {
    const [observer] = conditionalObserverResult!;
    observer.observe({ entryTypes: ['mark', 'longtask'] });
    performance.mark(perfMarkName);
  }

  useEffect(() => {
    if (isSupported) {
      const [, callback] = conditionalObserverResult!;
      firstTimeRunRec.current = false;
      if (measureFromCreating) {
        setChildrenProps((info) => ({ ...info, status: 'pending' }));
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
