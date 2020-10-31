import { useEffect, useState } from 'react';

interface Settings {
  readonly thresholdToEndorseInterval: number;
  readonly gapIntervalMultiFactor: number;
}

const REQUEST_INTERVAL = 1;
let settings: Settings = { thresholdToEndorseInterval: 50, gapIntervalMultiFactor: 100 };
let isMeasureStarted = false;

export function defineSettings(s: Partial<Settings>): void {
  settings = { ...settings, ...s };
}

function emitBlankPromise<T extends unknown>(): [Promise<T>, (toResolve: T) => void] {
  let resolver: (toResolve: T) => void;

  return [
    new Promise<T>((res) => {
      resolver = res;
    }),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolver!,
  ];
}

type TimeInterval = readonly [number, number];
interface IntervalPromise {
  promise: Promise<TimeInterval | IntervalPromise>;
}

function isInterval(v: TimeInterval | IntervalPromise): v is TimeInterval {
  return (v as TimeInterval).length !== undefined;
}

let intervalID: NodeJS.Timeout | null;
let evaluatedIntervalPromise: Promise<TimeInterval | IntervalPromise>;
let lastTime: number;
let analyzeStartTime: number;

function mainMeasureProcess() {
  let evaluatedInterval: TimeInterval | undefined;
  let curResolver: (v: TimeInterval | IntervalPromise) => void;
  [evaluatedIntervalPromise, curResolver] = emitBlankPromise<TimeInterval | IntervalPromise>();

  function analyze(): void {
    const curTime = performance.now();

    if (curTime - lastTime > settings.thresholdToEndorseInterval) {
      evaluatedInterval = evaluatedInterval ? [evaluatedInterval[0], curTime] : [lastTime, curTime];
    } else if (
      curTime - (evaluatedInterval ? evaluatedInterval[1] : analyzeStartTime) >
      settings.thresholdToEndorseInterval * settings.gapIntervalMultiFactor
    ) {
      const snapshotResolver = curResolver;
      [evaluatedIntervalPromise, curResolver] = emitBlankPromise<TimeInterval | IntervalPromise>();
      snapshotResolver(evaluatedInterval ?? { promise: evaluatedIntervalPromise });

      analyzeStartTime = curTime;
      evaluatedInterval = undefined;
    }

    lastTime = curTime;
  }

  intervalID = setInterval(analyze, REQUEST_INTERVAL);
}

export function measure(command: 'start' | 'stop'): void {
  if (command === 'start') {
    if (!isMeasureStarted) {
      isMeasureStarted = true;
      lastTime = performance.now();
      analyzeStartTime = lastTime;
      mainMeasureProcess();
    }
  } else if (typeof intervalID === 'number') {
    clearInterval(intervalID);
    intervalID = null;
  }
}

interface UseMeasurePerformParams {
  readonly dependencies: readonly unknown[] | undefined;
  readonly cleanUpPrev: boolean;
}

const defParams: UseMeasurePerformParams = { dependencies: [], cleanUpPrev: true };

export function useMeasurePerformance(
  params: Partial<UseMeasurePerformParams> = {}
): number | null {
  measure('start');

  const { dependencies, cleanUpPrev } = { ...defParams, ...params };
  const [duration, setDuration] = useState<number | null>(null);
  const startTime = performance.now();

  const snapshotPromise = evaluatedIntervalPromise;

  useEffect(() => {
    if (cleanUpPrev) {
      setDuration(null);
    }

    snapshotPromise.then((intervalOrNextPromise) => {
      if (isInterval(intervalOrNextPromise)) {
        setDuration(intervalOrNextPromise[1] - intervalOrNextPromise[0]);
        // const dur = intervalOrNextPromise[1] - startTime;
        // setDuration(dur < settings.thresholdToEndorseInterval ? 0 : dur);
      } else {
        intervalOrNextPromise.promise.then((nextIntervalOrPromise) => {
          if (
            !isInterval(nextIntervalOrPromise) ||
            nextIntervalOrPromise[0] - startTime >
              settings.thresholdToEndorseInterval * settings.gapIntervalMultiFactor
          ) {
            setDuration(0);
          } else {
            setDuration(nextIntervalOrPromise[1] - nextIntervalOrPromise[0]);
            // setDuration(nextIntervalOrPromise[1] - startTime);
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return duration;
}
