/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React from 'react';
import type { PerformanceEntrySimplified } from './PerformanceObserver.supported.mock';
import { createMockedPerfObserver } from './PerformanceObserver.supported.mock';
import type { Retrieve } from './TestComponent';
import { TestComponent } from './TestComponent';

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

  test('using of option "measureAtEffectStage" is consistent', () => {
    const retrieve: Retrieve = {};
    let payloadDone = false;

    const payload = () => {
      payloadDone = true;
    };

    jest.useFakeTimers();

    const { unmount, rerender } = render(
      <TestComponent
        measureFromCreated
        {...{
          retrieve,
          effectSettings: { measureAtEffectStage: true, payload: null },
          id: 'start',
        }}
      />
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
    expect(retrieve.lunchedAtEffectStage).toBeTruthy();

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

    act(() => retrieve.measurePerformance!({ measureAtEffectStage: true, payload: null }));

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
    expect(retrieve.lunchedAtEffectStage).toBeTruthy();

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

    act(() =>
      retrieve.measurePerformance!({
        id: 'nonsense',
        measureAtEffectStage: true,
        payload,
      })
    );

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 30000, duration: 1800 },
        { entryType: 'mark', name: 'nonsense-0', startTime: 30300 },
        { entryType: 'longtask', startTime: 37000, duration: 1000 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 1500, TBT: 1500 });
    expect(retrieve.lunchedAtEffectStage).toBeTruthy();
    expect(payloadDone).toBeTruthy();
    payloadDone = false;

    rerender(
      <TestComponent
        measureFromCreated
        {...{
          retrieve,
          effectSettings: { measureAtEffectStage: true, payload },
          id: 'new-try',
        }}
      />
    );

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    addPerfEntries([{ entryType: 'mark', name: 'new-try-1', startTime: 40200 }]);

    jest.advanceTimersByTime(4900);

    addPerfEntries([{ entryType: 'longtask', startTime: 45200, duration: 150 }], {
      toFireImmediately: true,
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });
    expect(retrieve.lunchedAtEffectStage).toBeTruthy();
    expect(payloadDone).toBeTruthy();
    payloadDone = false;

    unmount();
  });
});

export {};
