/* eslint-disable react-hooks/exhaustive-deps */
import { getNextKey } from 'get-next-key';
import type { FC, MutableRefObject, ReactElement } from 'react';
import React, { cloneElement, useEffect, useMemo, useRef, useState } from 'react';

const MIN_QUIET_WINDOW_DURATION = 5000;
const MIN_LONG_TASK_DURATION = 50;

export interface Measures {
  TTI: number;
  TBT: number;
}

export interface MetricsComponentProps {
  data: Measures | null;
  status?: 'never' | 'pending' | 'done' | 'error';
}

interface UsePerfObserverSettings {
  measureFromCreating: boolean;
}

const defSettings: UsePerfObserverSettings = {
  measureFromCreating: false,
};

type WrapMetricsComponentChildren = { children: ReactElement<MetricsComponentProps> };

const MeasureComponent: FC<
  WrapMetricsComponentChildren & {
    startMeasure: MutableRefObject<() => void>;
    firstTimeRun: MutableRefObject<boolean>;
    measureFromCreating: boolean;
  }
> = ({ children: nestedComponent, startMeasure, firstTimeRun, measureFromCreating }) => {
  const [perfMarkName] = useState(() => getNextKey('start'));
  const [isSupported] = useState(() => {
    const { supportedEntryTypes } = PerformanceObserver;

    if (
      supportedEntryTypes &&
      supportedEntryTypes.includes('mark') &&
      supportedEntryTypes.includes('longtask')
    ) {
      return true;
    }

    return false;
  });
  const [childrenProps, setChildrenProps] = useState<Required<MetricsComponentProps>>(() => {
    if (isSupported) {
      return { data: null, status: 'never' };
    }

    return { data: null, status: 'error' };
  });

  const stateFlags = useRef({ useEffectRegistered: false });
  const timeoutIDRec = useRef<NodeJS.Timeout | null>(null);

  const [observer] = useState<PerformanceObserver | null>(() => {
    let initRun = true;
    let evalTBT = 0;
    let timeOfStartingMeasure = 0;
    let lastEndTime: number;

    function finishMeasure() {
      setChildrenProps({
        data: { TTI: lastEndTime - timeOfStartingMeasure, TBT: evalTBT },
        status: 'done',
      });
    }

    if (isSupported) {
      const createdObserver = new PerformanceObserver((list, obs) => {
        const {
          current: { useEffectRegistered },
        } = stateFlags;

        function clearScheduledTimeout({ scheduleNext }: { scheduleNext: boolean }) {
          const { current: timeoutID } = timeoutIDRec;
          if (timeoutID !== null) {
            clearTimeout(timeoutID);
          }

          if (scheduleNext) {
            timeoutIDRec.current = setTimeout(() => {
              obs.disconnect();
              timeoutIDRec.current = null;
              if (stateFlags.current.useEffectRegistered) {
                finishMeasure();
              }
            }, MIN_QUIET_WINDOW_DURATION);
            return;
          }

          obs.disconnect();
          timeoutIDRec.current = null;
        }

        clearScheduledTimeout({ scheduleNext: true });
        if (initRun || useEffectRegistered) {
          initRun = false;

          if (!timeOfStartingMeasure) {
            const markList = list.getEntriesByName(perfMarkName);
            if (markList.length > 0) {
              [{ startTime: timeOfStartingMeasure }] = markList;
              lastEndTime = timeOfStartingMeasure;
            } else {
              clearScheduledTimeout({ scheduleNext: false });
              setChildrenProps((info) => ({ ...info, status: 'error' }));
              return;
            }

            obs.observe({ entryTypes: ['longtask'] });
          }

          const longTasksList = list.getEntriesByType('longtask');
          if (longTasksList.length > 0) {
            longTasksList.every((task) => {
              const { startTime, duration } = task;
              const delta = startTime - lastEndTime;

              if (delta >= MIN_QUIET_WINDOW_DURATION) {
                clearScheduledTimeout({ scheduleNext: false });
                finishMeasure();
                return false;
              }

              if (-delta < duration) {
                if (delta > 0 || -delta < MIN_LONG_TASK_DURATION) {
                  evalTBT += duration - MIN_LONG_TASK_DURATION;
                } else {
                  evalTBT += duration + delta;
                }
                lastEndTime = startTime + duration;
              }

              return true;
            });
          }
        } else {
          clearScheduledTimeout({ scheduleNext: false });
        }
      });

      // eslint-disable-next-line no-param-reassign
      startMeasure.current = () => {
        evalTBT = 0;
        timeOfStartingMeasure = 0;
        setChildrenProps((info) => ({ ...info, status: 'pending' }));
        createdObserver.observe({ entryTypes: ['mark', 'longtask'] });
        performance.mark(perfMarkName);
      };

      return createdObserver;
    }

    return null;
  });

  if (firstTimeRun.current && measureFromCreating && observer) {
    observer.observe({ entryTypes: ['mark', 'longtask'] });
    performance.mark(perfMarkName);
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    stateFlags.current.useEffectRegistered = true;
    // eslint-disable-next-line no-param-reassign
    firstTimeRun.current = false;

    if (observer) {
      if (measureFromCreating) {
        setChildrenProps((info) => ({ ...info, status: 'pending' }));
      }

      return () => {
        const { current: timeoutID } = timeoutIDRec;
        observer.disconnect();
        if (timeoutID !== null) {
          clearTimeout(timeoutID);
        }
      };
    }
  }, []);

  const nestedComponentWithProps = useMemo(
    () => cloneElement(nestedComponent as ReactElement<MetricsComponentProps>, childrenProps),
    [childrenProps]
  );

  return nestedComponentWithProps;
};

export function usePerfObserver(
  settings: Partial<UsePerfObserverSettings> = {}
): [FC<WrapMetricsComponentChildren>, () => void] {
  const { measureFromCreating } = { ...defSettings, ...settings };

  const startMeasure = useRef(() => {});
  const firstTimeRun = useRef(true);

  const [usePerfObserverReturn] = useState<[FC<WrapMetricsComponentChildren>, () => void]>([
    function WrapMetrics({ children }: WrapMetricsComponentChildren) {
      return (
        <MeasureComponent {...{ startMeasure, firstTimeRun, measureFromCreating }}>
          {children}
        </MeasureComponent>
      );
    },

    () => startMeasure.current(),
  ]);

  return usePerfObserverReturn;
}
