/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React from 'react';
import type { PerformanceEntrySimplified } from './assets/PerformanceObserver.supported.mock';
import { createMockedPerfObserver } from './assets/PerformanceObserver.supported.mock';
import type { Retrieve } from './assets/TestComponent';
import { TestComponent } from './assets/TestComponent';

describe('Test usePerfMetric', () => {
  let addPerfEntries: (
    entries: PerformanceEntrySimplified[],
    settings?:
      | {
          toFireImmediately: boolean;
        }
      | undefined
  ) => void;

  beforeAll(() => {
    const mockedPerfObserver = createMockedPerfObserver();
    const { MockedPerformanceObserver, mockPerformanceMark } = mockedPerfObserver;
    ({ addPerfEntries } = mockedPerfObserver);
    global.PerformanceObserver = MockedPerformanceObserver;
    performance.mark = mockPerformanceMark;
  });

  afterAll(() => {
    delete (global as any).PerformanceObserver;
    delete (performance as any).mark;
  });

  test('general use is consistent', () => {
    const retrieve: Retrieve = {};

    jest.useFakeTimers();

    const { unmount, rerender } = render(
      <TestComponent measureFromCreated {...{ retrieve, id: 'start' }} />
    );

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([
      { entryType: 'mark', name: 'start-0', startTime: 1 },
      { entryType: 'mark', name: 'start-1', startTime: 5 },
      { entryType: 'longtask', startTime: 25, duration: 140 },
      { entryType: 'longtask', startTime: 200, duration: 210 },
    ]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 405, TBT: 250 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([
      { entryType: 'mark', name: 'start-2', startTime: 500 },
      { entryType: 'longtask', startTime: 510, duration: 200 },
      { entryType: 'mark', name: 'nonsense', startTime: 530 },
      { entryType: 'longtask', startTime: 900, duration: 77 },
    ]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries(
        [
          { entryType: 'mark', name: 'nonsense', startTime: 1200 },
          { entryType: 'longtask', startTime: 5977, duration: 122 },
        ],
        { toFireImmediately: true }
      )
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 477, TBT: 177 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([
      { entryType: 'longtask', startTime: 8000, duration: 1000 },
      { entryType: 'mark', name: 'start-3', startTime: 8120 },
      { entryType: 'longtask', startTime: 13999, duration: 122 },
    ]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 6001, TBT: 952 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 14500, duration: 230 },
        { entryType: 'mark', name: 'start-4', startTime: 14550 },
        { entryType: 'longtask', startTime: 16000, duration: 200 },
        { entryType: 'longtask', startTime: 21200, duration: 100 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 1650, TBT: 330 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 30000, duration: 1800 },
        { entryType: 'mark', name: 'start-5', startTime: 30300 },
        { entryType: 'longtask', startTime: 37000, duration: 1000 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 1500, TBT: 1500 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([{ entryType: 'mark', name: 'start-6', startTime: 40200 }]);

    jest.advanceTimersByTime(4900);

    addPerfEntries([{ entryType: 'longtask', startTime: 45200, duration: 150 }], {
      toFireImmediately: true,
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(() => retrieve.measurePerformance!({ id: 'other-name' }));

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'other-name-0', startTime: 81000 },
        { entryType: 'longtask', startTime: 85301, duration: 550 },
        { entryType: 'longtask', startTime: 86000, duration: 51 },
        { entryType: 'longtask', startTime: 95000, duration: 1000 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 5051, TBT: 501 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([{ entryType: 'mark', name: 'start-7', startTime: 100000 }]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    rerender(<TestComponent {...{ retrieve }} />);

    expect(retrieve.status).toBe('never');
    expect(retrieve.data).toBeNull();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-use-perf-metrics-0', startTime: 150000 },
        { entryType: 'longtask', startTime: 150000, duration: 150 },
        { entryType: 'longtask', startTime: 154000, duration: 150 },
        { entryType: 'longtask', startTime: 159150, duration: 150 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 4150, TBT: 200 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    rerender(<TestComponent {...{ retrieve, id: 'fancy-name' }} />);

    expect(retrieve.status).toBe('never');
    expect(retrieve.data).toBeNull();

    act(retrieve.measurePerformance!);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() => addPerfEntries([{ entryType: 'mark', name: 'fancy-name-0', startTime: 200000 }]));

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });
    expect(retrieve.lunchedAtEffectStage).toBeFalsy();

    unmount();
  });
});

export {};
