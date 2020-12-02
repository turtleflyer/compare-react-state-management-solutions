/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, render } from '@testing-library/react';
import React from 'react';
import { addPerfEntries, mockPerformanceMark } from './PerformanceObserver.supported.mock';
import type { Retrieve } from './TestComponent';
import { TestComponent } from './TestComponent';

describe('Test usePerfObserver', () => {
  beforeAll(() => {
    performance.mark = mockPerformanceMark;
  });

  afterAll(() => {
    delete ((performance as unknown) as { mark: never }).mark;
  });

  test('general use is consistent', () => {
    const retrieve: Retrieve = {};

    jest.useFakeTimers();

    const { unmount, rerender } = render(
      <TestComponent measureFromCreating {...{ retrieve, name: 'start' }} />
    );

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBe(null);

    addPerfEntries([
      { entryType: 'mark', name: 'start-0', startTime: 1 },
      { entryType: 'mark', name: 'start-1', startTime: 5 },
      { entryType: 'longtask', startTime: 25, duration: 140 },
      { entryType: 'longtask', startTime: 200, duration: 210 },
    ]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toBe(null);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 405, TBT: 250 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    addPerfEntries([
      { entryType: 'mark', name: 'start-1', startTime: 500 },
      { entryType: 'longtask', startTime: 510, duration: 200 },
      { entryType: 'mark', name: 'nonsense', startTime: 530 },
      { entryType: 'longtask', startTime: 900, duration: 77 },
    ]);

    expect(retrieve.status).toBe('pending');
    expect(retrieve.data).toEqual({ TTI: 405, TBT: 250 });

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

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    addPerfEntries([
      { entryType: 'longtask', startTime: 8000, duration: 1000 },
      { entryType: 'mark', name: 'start-1', startTime: 8120 },
      { entryType: 'longtask', startTime: 13999, duration: 122 },
    ]);

    expect(retrieve.status).toBe('pending');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 6001, TBT: 952 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 14500, duration: 230 },
        { entryType: 'mark', name: 'start-1', startTime: 14550 },
        { entryType: 'longtask', startTime: 16000, duration: 200 },
        { entryType: 'longtask', startTime: 21200, duration: 100 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 1650, TBT: 330 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 30000, duration: 1800 },
        { entryType: 'mark', name: 'start-1', startTime: 30300 },
        { entryType: 'longtask', startTime: 37000, duration: 1000 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 1500, TBT: 1500 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    addPerfEntries([{ entryType: 'mark', name: 'start-1', startTime: 40200 }]);

    jest.advanceTimersByTime(4900);

    addPerfEntries([{ entryType: 'longtask', startTime: 45200, duration: 150 }], {
      toFireImmediately: true,
    });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-1', startTime: 81000 },
        { entryType: 'longtask', startTime: 85301, duration: 550 },
        { entryType: 'longtask', startTime: 86000, duration: 51 },
        { entryType: 'longtask', startTime: 95000, duration: 1000 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 5051, TBT: 501 });

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    addPerfEntries([{ entryType: 'mark', name: 'start-1', startTime: 100000 }]);

    expect(retrieve.status).toBe('pending');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });

    rerender(<TestComponent {...{ retrieve }} />);

    expect(retrieve.status).toBe('never');

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-use-perf-metrics-1', startTime: 150000 },
        { entryType: 'longtask', startTime: 150000, duration: 150 },
        { entryType: 'longtask', startTime: 154000, duration: 150 },
        { entryType: 'longtask', startTime: 159150, duration: 150 },
      ])
    );

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 4150, TBT: 200 });

    rerender(<TestComponent {...{ retrieve, name: 'fancy-name' }} />);

    expect(retrieve.status).toBe('never');

    act(retrieve.startMeasure!);

    expect(retrieve.status).toBe('pending');

    act(() => addPerfEntries([{ entryType: 'mark', name: 'fancy-name-1', startTime: 200000 }]));

    expect(retrieve.status).toBe('pending');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieve.status).toBe('done');
    expect(retrieve.data).toEqual({ TTI: 0, TBT: 0 });

    unmount();
  });
});

export {};
