import type { Dispatch, SetStateAction } from 'react';
import { MIN_LONG_TASK_DURATION, MIN_QUIET_WINDOW_DURATION } from './constParameters';
import type { CreateObserverResult, Measures, MetricsComponentProps } from './PerfMetricsTypes';

function clearScheduledTimeout(
  tID: NodeJS.Timeout | undefined,
  observer: PerformanceObserver,
  stateFlags: { useEffectRegistered: boolean },
  settings:
    | { scheduleNext: true; finish: () => void }
    | { scheduleNext: false; finish?: () => void }
): NodeJS.Timeout | undefined {
  tID === undefined || clearTimeout(tID);

  return settings.scheduleNext
    ? setTimeout(() => {
        observer.disconnect();
        if (stateFlags.useEffectRegistered) {
          settings.finish();
        }
      }, MIN_QUIET_WINDOW_DURATION)
    : (observer.disconnect() as undefined) || (settings.finish?.() as undefined);
}

function calculateResult(
  evalTBT: number,
  start: number,
  end: number,
  firstLongTaskEntry: PerformanceEntry | undefined
): Measures {
  const { startTime: startLongTask, duration } = firstLongTaskEntry ?? {
    startTime: start,
    duration: 0,
  };
  const delta = start - startLongTask;
  const isZero = -delta >= MIN_QUIET_WINDOW_DURATION;

  return {
    TTI: isZero ? 0 : Math.max(0, end - start),
    TBT: isZero
      ? 0
      : evalTBT +
        Math.max(
          0,
          delta < MIN_LONG_TASK_DURATION ? duration - MIN_LONG_TASK_DURATION : duration - delta
        ),
  };
}

export function createObserver(
  perfMarkName: string,
  updateChildrenProps: Dispatch<SetStateAction<Required<MetricsComponentProps>>>,
  updateStartMeasureCallback: (startMeasure: () => void) => void
): CreateObserverResult {
  let initRun = true;
  let evalTBT = 0;
  let lastEndTime: number;
  let timeoutID: NodeJS.Timeout | undefined;
  let markEntry: PerformanceEntry | undefined;
  let firstLongTaskEntry: PerformanceEntry | undefined;
  const stateFlags = { useEffectRegistered: false };

  function finish() {
    updateChildrenProps({
      data: calculateResult(evalTBT, markEntry!.startTime, lastEndTime, firstLongTaskEntry),
      status: 'done',
    });
  }

  const createdObserver = new PerformanceObserver((list, observer) => {
    const { useEffectRegistered } = stateFlags;

    timeoutID = clearScheduledTimeout(timeoutID, observer, stateFlags, {
      scheduleNext: true,
      finish,
    });

    if (initRun || useEffectRegistered) {
      initRun = false;

      if (!markEntry) {
        const markList = list.getEntriesByName(perfMarkName);
        if (markList.length > 0) {
          [markEntry] = markList;
          observer.observe({ entryTypes: ['longtask'] });
        } else {
          updateChildrenProps((props) => ({ ...props, status: 'error' }));
          timeoutID = clearScheduledTimeout(timeoutID, observer, stateFlags, {
            scheduleNext: false,
          });
          return;
        }
      }

      const longTasksList = list.getEntriesByType('longtask');
      if (longTasksList.length > 0) {
        longTasksList.every((task) => {
          const { startTime, duration } = task;
          if (!firstLongTaskEntry) {
            firstLongTaskEntry = task;
          } else {
            if (startTime - lastEndTime >= MIN_QUIET_WINDOW_DURATION) {
              timeoutID = clearScheduledTimeout(timeoutID, observer, stateFlags, {
                scheduleNext: false,
                finish,
              });

              return false;
            }

            evalTBT += duration - MIN_LONG_TASK_DURATION;
          }

          lastEndTime = startTime + duration;

          return true;
        });
      }
    } else {
      clearScheduledTimeout(timeoutID, observer, stateFlags, { scheduleNext: false, finish });
    }
  });

  updateStartMeasureCallback(() => {
    evalTBT = 0;
    markEntry = undefined;
    firstLongTaskEntry = undefined;
    updateChildrenProps((info) => ({ ...info, status: 'pending' }));
    createdObserver.observe({ entryTypes: ['mark', 'longtask'] });
    performance.mark(perfMarkName);
  });

  return [
    createdObserver,
    () => {
      stateFlags.useEffectRegistered = true;

      return () => {
        createdObserver.disconnect();
        timeoutID = clearScheduledTimeout(timeoutID, createdObserver, stateFlags, {
          scheduleNext: false,
        });
      };
    },
  ];
}
