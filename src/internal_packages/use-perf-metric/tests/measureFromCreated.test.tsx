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

  test('using of option "measureFromCreated" is consistent', () => {
    const retrieve: Retrieve = {};
    jest.useFakeTimers();

    const { unmount, rerender } = render(
      <TestComponent measureFromCreated {...{ retrieve, id: 'start' }} />
    );

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-0', startTime: 0 },
        { entryType: 'mark', name: 'start-1', startTime: 0 },
        { entryType: 'longtask', startTime: 0, duration: 100 },
        { entryType: 'longtask', startTime: 6000, duration: 1 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 100, TBT: 50 });

    rerender(
      <TestComponent measureFromCreated {...{ retrieve, id: 'start', freshRemount: false }} />
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 100, TBT: 50 });

    rerender(<TestComponent measureFromCreated {...{ retrieve, id: 'start' }} />);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBeNull();

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-2', startTime: 7000 },
        { entryType: 'mark', name: 'start-3', startTime: 7000 },
        { entryType: 'longtask', startTime: 7000, duration: 200 },
        { entryType: 'longtask', startTime: 13000, duration: 1 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 200, TBT: 150 });

    rerender(<TestComponent {...{ retrieve, id: 'start' }} />);

    expect(retrieve.status).toBe('never');
    expect(retrieve.data).toBeNull();

    unmount();
  });
});

export {};
