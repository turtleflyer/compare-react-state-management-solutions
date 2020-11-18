/* eslint-disable class-methods-use-this */
import { act, render } from '@testing-library/react';
import type { FC } from 'react';
import React, { StrictMode, useEffect, useState } from 'react';
import { Measures, MetricsComponentProps, usePerfObserver } from '../usePerfObserver';

describe('Test usePerfObserver', () => {
  test('working properly', () => {
    const supportedTypesCommonBase = ['measure', 'navigation', 'resource'];
    let currentSupportedTypes: string[];

    interface CompatibilitySettings {
      mark: boolean;
      longtask: boolean;
    }

    function defineCompatibility(settings: CompatibilitySettings) {
      currentSupportedTypes = [
        ...supportedTypesCommonBase,
        ...Object.keys(settings).filter((k) => settings[k as keyof CompatibilitySettings]),
      ];
    }

    type SelectedEntriesTypes = 'mark' | 'longtask';

    type PerformanceEntrySimplified = { startTime: number } & (
      | { entryType: 'mark'; name: string }
      | { entryType: 'longtask'; duration: number }
    ) &
      Partial<PerformanceEntry>;

    let observersCalls: ((types: SelectedEntriesTypes[]) => void)[] = [];
    let perfEntriesSequence: PerformanceEntrySimplified[] = [];
    let freshlyAddedTypes: SelectedEntriesTypes[] = [];
    let requestsOnPerfMarkFlag = false;

    function fireObserver() {
      observersCalls.forEach((c) => c(freshlyAddedTypes));
      freshlyAddedTypes = [];
      perfEntriesSequence = [];
    }

    function addPerfEntries(entries: PerformanceEntrySimplified[], toFire = false) {
      let fireImmediately = toFire;

      perfEntriesSequence = [...perfEntriesSequence, ...entries];
      freshlyAddedTypes = (['mark', 'longtask'] as SelectedEntriesTypes[]).filter(
        (t) => freshlyAddedTypes.includes(t) || entries.some(({ entryType }) => t === entryType)
      );

      if (requestsOnPerfMarkFlag && freshlyAddedTypes.includes('mark')) {
        requestsOnPerfMarkFlag = false;
        fireImmediately = true;
      }

      if (fireImmediately) {
        fireObserver();
      }
    }

    performance.mark = () => {
      requestsOnPerfMarkFlag = true;
    };

    class MockedPerformanceObserver {
      private list = {
        getEntriesByName: (name: string) => {
          if (this.entryTypeSubscribe.mark) {
            return perfEntriesSequence.filter(
              (e) => e.entryType === 'mark' && e.name === name
            ) as PerformanceEntryList;
          }

          return [];
        },

        getEntriesByType: (type: string) => {
          if (type === 'longtask') {
            if (this.entryTypeSubscribe.longtask) {
              return perfEntriesSequence.filter(
                (e) => e.entryType === 'longtask'
              ) as PerformanceEntryList;
            }

            return [];
          }

          throw Error('(Error in test case) Type must be "longtask"');
        },

        getEntries() {
          return perfEntriesSequence;
        },
      } as PerformanceObserverEntryList;

      private entryTypeSubscribe = { mark: false, longtask: false };

      constructor(
        callback: (list: PerformanceObserverEntryList, obs: MockedPerformanceObserver) => void
      ) {
        observersCalls = [
          ...observersCalls,
          (types: SelectedEntriesTypes[]) => {
            if (types.some((t) => this.entryTypeSubscribe[t])) {
              callback(this.list, this);
            }
          },
        ];
      }

      static get supportedEntryTypes() {
        return currentSupportedTypes;
      }

      observe({ entryTypes }: { entryTypes: string[] }) {
        this.disconnect();
        entryTypes.forEach((type) => {
          if (type === 'mark' || type === 'longtask') {
            this.entryTypeSubscribe[type] = true;
            return;
          }

          throw Error('(Error in test case) Types must be "mark" or "longtask"');
        });
      }

      disconnect() {
        this.entryTypeSubscribe = { mark: false, longtask: false };
      }

      takeRecords: unknown;
    }

    global.PerformanceObserver = MockedPerformanceObserver as typeof PerformanceObserver;

    let retrieveData!: Measures | null;
    let retrieveStatus!: string;
    let retrieveStartMeasure!: () => void;

    const Display: FC<MetricsComponentProps> = ({ data, status = 'never' }) => {
      retrieveData = data;
      retrieveStatus = status;
      return <></>;
    };

    const Inner: FC<{ measureFromCreating: boolean }> = ({ measureFromCreating }) => {
      const [Wrap, startMeasure] = usePerfObserver({ measureFromCreating });
      retrieveStartMeasure = startMeasure;

      return (
        <Wrap>
          <Display {...{ data: null }} />
        </Wrap>
      );
    };

    const TestComponent: FC<{ measureFromCreating?: boolean }> = ({
      measureFromCreating = false,
    }) => {
      const [start, getStarted] = useState(true);

      // eslint-disable-next-line react-hooks/exhaustive-deps
      useEffect(() => {
        if (!start) {
          getStarted(true);
          return;
        }

        // eslint-disable-next-line consistent-return
        return () => {
          getStarted(false);
        };
      });

      return <StrictMode>{start ? <Inner {...{ measureFromCreating }} /> : null}</StrictMode>;
    };

    jest.useFakeTimers();

    defineCompatibility({ mark: true, longtask: true });
    const { unmount, rerender } = render(<TestComponent measureFromCreating />);

    expect(retrieveStatus).toBe('pending');
    expect(retrieveData).toBe(null);

    addPerfEntries([
      { entryType: 'mark', name: 'start-0', startTime: 1 },
      { entryType: 'mark', name: 'start-1', startTime: 5 },
      { entryType: 'longtask', startTime: 25, duration: 140 },
      { entryType: 'longtask', startTime: 200, duration: 210 },
    ]);

    expect(retrieveStatus).toBe('pending');
    expect(retrieveData).toBe(null);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 405, TBT: 250 });

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    addPerfEntries([
      { entryType: 'mark', name: 'start-1', startTime: 500 },
      { entryType: 'longtask', startTime: 510, duration: 200 },
      { entryType: 'mark', name: 'nonsense', startTime: 530 },
      { entryType: 'longtask', startTime: 900, duration: 77 },
    ]);

    expect(retrieveStatus).toBe('pending');
    expect(retrieveData).toEqual({ TTI: 405, TBT: 250 });

    act(() =>
      addPerfEntries(
        [
          { entryType: 'mark', name: 'nonsense', startTime: 1200 },
          { entryType: 'longtask', startTime: 5977, duration: 122 },
        ],
        true
      )
    );

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 477, TBT: 177 });

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    addPerfEntries([
      { entryType: 'longtask', startTime: 8000, duration: 1000 },
      { entryType: 'mark', name: 'start-1', startTime: 8120 },
      { entryType: 'longtask', startTime: 13999, duration: 122 },
    ]);

    expect(retrieveStatus).toBe('pending');

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 6001, TBT: 952 });

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 14500, duration: 230 },
        { entryType: 'mark', name: 'start-1', startTime: 14550 },
        { entryType: 'longtask', startTime: 16000, duration: 200 },
        { entryType: 'longtask', startTime: 21200, duration: 100 },
      ])
    );

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 1650, TBT: 330 });

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 30000, duration: 1800 },
        { entryType: 'mark', name: 'start-1', startTime: 30300 },
        { entryType: 'longtask', startTime: 37000, duration: 1000 },
      ])
    );

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 1500, TBT: 1500 });

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'longtask', startTime: 40000, duration: 150 },
        { entryType: 'mark', name: 'start-1', startTime: 40200 },
        { entryType: 'longtask', startTime: 45200, duration: 150 },
      ])
    );

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 0, TBT: 0 });

    rerender(<TestComponent />);

    expect(retrieveStatus).toBe('never');

    act(retrieveStartMeasure);

    expect(retrieveStatus).toBe('pending');

    act(() =>
      addPerfEntries([
        { entryType: 'mark', name: 'start-3', startTime: 50000 },
        { entryType: 'longtask', startTime: 50000, duration: 150 },
        { entryType: 'longtask', startTime: 54000, duration: 150 },
        { entryType: 'longtask', startTime: 59150, duration: 150 },
      ])
    );

    expect(retrieveStatus).toBe('done');
    expect(retrieveData).toEqual({ TTI: 4150, TBT: 200 });

    defineCompatibility({ mark: true, longtask: false });

    rerender(<TestComponent measureFromCreating />);

    expect(retrieveStatus).toBe('error');

    unmount();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete performance.mark;
  });
});

export {};
