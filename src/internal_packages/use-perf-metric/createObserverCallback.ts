import {
  errorNoMarkEvent,
  MIN_LONG_TASK_DURATION,
  MIN_QUIET_WINDOW_DURATION,
} from './constParameters';
import type { PerfMetric } from './PerfMetricTypes';

export const createObserverCallback = (
  perfMarkName: string,
  postErrorStatus: (error: Error) => void,
  postCalculatedData: (result: PerfMetric) => void,
  isFirstRunOrUseEffectRegistered: () => boolean
): PerformanceObserverCallback => {
  let timeoutID: NodeJS.Timeout | null = null;
  let markEvent: PerformanceEntry | null = null;
  let firstLongTaskEntry: PerformanceEntry | null = null;
  let lastEndTime: number | null = null;
  let evalTBT = 0;

  const calculateResult = (): PerfMetric => {
    if (!firstLongTaskEntry) {
      return { TTI: 0, TBT: 0 };
    }

    const { startTime: markEventStartTime } = markEvent ?? throwErrorNoMarkEvent();

    const { startTime: firstLongTaskStartTime, duration: firstLongTaskDuration } =
      firstLongTaskEntry;

    const delta = markEventStartTime - firstLongTaskStartTime;
    const isZero = -delta >= MIN_QUIET_WINDOW_DURATION;

    return {
      TTI:
        !isZero && isLastEndTimeDefined(lastEndTime)
          ? Math.max(0, lastEndTime - markEventStartTime)
          : 0,

      TBT: isZero
        ? 0
        : evalTBT + Math.max(0, firstLongTaskDuration - Math.max(MIN_LONG_TASK_DURATION, delta)),
    };
  };

  return (list: PerformanceObserverEntryList, observer: PerformanceObserver): void => {
    clearScheduledTimeout();

    if (isFirstRunOrUseEffectRegistered()) {
      if (!markEvent) {
        const markList = list.getEntriesByName(perfMarkName);

        if (markList.length > 0) {
          [markEvent] = markList;
          observer.observe({ entryTypes: ['longtask'] });
        } else {
          postErrorStatus(errorNoMarkEvent);
          observer.disconnect();

          return;
        }
      }

      rescheduleTimeout();
      const longTasksList = list.getEntriesByType('longtask');

      longTasksList.every((task) => {
        const { startTime, duration } = task;

        if (!firstLongTaskEntry) {
          firstLongTaskEntry = task;
        } else {
          if (
            isLastEndTimeDefined(lastEndTime) &&
            startTime - lastEndTime >= MIN_QUIET_WINDOW_DURATION
          ) {
            postCalculatedData(calculateResult());
            clearScheduledTimeout();
            observer.disconnect();

            return false;
          }

          evalTBT += duration - MIN_LONG_TASK_DURATION;
        }

        lastEndTime = startTime + duration;

        return true;
      });
    } else {
      clearScheduledTimeout();
      observer.disconnect();
    }

    function clearScheduledTimeout(): void {
      timeoutID && clearTimeout(timeoutID);
    }

    function rescheduleTimeout(): void {
      timeoutID = setTimeout(() => {
        observer.disconnect();
        postCalculatedData(calculateResult());
      }, MIN_QUIET_WINDOW_DURATION);
    }
  };

  function isLastEndTimeDefined(time: number | null): time is number {
    if (time !== lastEndTime) {
      throw Error('(usePerfMetrics) error while using last end time');
    }

    return !!firstLongTaskEntry;
  }
};

function throwErrorNoMarkEvent(): never {
  throw errorNoMarkEvent;
}
