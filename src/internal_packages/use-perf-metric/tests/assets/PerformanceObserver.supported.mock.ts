export type SelectedEntriesTypes = 'mark' | 'longtask';

export interface MarkEventEntry {
  entryType: 'mark';
  name: string;
}

export interface LongTaskEventEntry {
  entryType: 'longtask';
  duration: number;
}

export type PerformanceEntrySimplified = (MarkEventEntry | LongTaskEventEntry) & {
  entryType: SelectedEntriesTypes;
} & Pick<PerformanceEntry, 'startTime'> &
  Partial<PerformanceEntry>;

export const createMockedPerfObserver = (): {
  addPerfEntries: (
    entries: PerformanceEntrySimplified[],
    settings?: {
      toFireImmediately: boolean;
    }
  ) => void;

  mockPerformanceMark: (name: string) => void;

  MockedPerformanceObserver: typeof PerformanceObserver;
} => {
  let observersCalls: ((types: SelectedEntriesTypes[]) => void)[] = [];
  let perfEntriesSequence: PerformanceEntrySimplified[] = [];
  let freshlyAddedTypes: SelectedEntriesTypes[] = [];
  let perfMarkNamesRequested: string[] = [];

  const addPerfEntries = (
    entries: PerformanceEntrySimplified[],
    settings: { toFireImmediately: boolean } = { toFireImmediately: false }
  ): void => {
    let { toFireImmediately } = settings;

    if (perfMarkNamesRequested.length > 0) {
      let lastObservedName: string | null = null;
      if (
        perfMarkNamesRequested.some((name) => {
          lastObservedName = name;
          return entries.every((e) => {
            return e.entryType !== 'mark' || e.name !== name;
          });
        })
      ) {
        throw Error(
          `(Error in test case) Some "mark" events are missing${
            lastObservedName ? `: "${lastObservedName}"` : ''
          }`
        );
      }

      toFireImmediately = true;
    }

    perfEntriesSequence = [...perfEntriesSequence, ...entries];

    freshlyAddedTypes = (['mark', 'longtask'] as const).filter(
      (t) => freshlyAddedTypes.includes(t) || entries.some(({ entryType }) => t === entryType)
    );

    if (toFireImmediately) {
      fireObserver();
    }
  };

  const mockPerformanceMark = (name: string): void => {
    perfMarkNamesRequested = [...perfMarkNamesRequested, name];
    // requestsOnPerfMarkFlag = true;
  };

  class MockedPerformanceObserver implements PerformanceObserver {
    constructor(callback: (list: PerformanceObserverEntryList, obs: PerformanceObserver) => void) {
      observersCalls = [
        ...observersCalls,
        (types: SelectedEntriesTypes[]) => {
          if (types.some((t) => this.entryTypeSubscribe[t])) {
            callback(this.list, this);
          }
        },
      ];

      this.chosenInterface = null;
    }

    observe(
      settings:
        | { entryTypes: string[]; type?: undefined }
        | { type: string; buffered?: boolean; entryTypes?: undefined }
    ): void {
      if (
        (settings.entryTypes && this.chosenInterface === 'types') ||
        (settings.type && this.chosenInterface === 'entryTypes')
      ) {
        throw Error('(Error in test case) Observer call interface may not be changed');
      }

      if (settings.entryTypes) {
        const { entryTypes } = settings;
        this.chosenInterface = 'entryTypes';
        this.disconnect();

        entryTypes.forEach(this.addType);
      } else {
        this.chosenInterface = 'types';
        this.addType(settings.type);
      }
    }

    disconnect(): void {
      this.entryTypeSubscribe = { mark: false, longtask: false };
    }

    private list = {
      getEntriesByName: (name: string): PerformanceEntryList => {
        if (this.entryTypeSubscribe.mark) {
          return perfEntriesSequence.filter(
            (e) => e.entryType === 'mark' && e.name === name
          ) as PerformanceEntryList;
        }

        return [];
      },

      getEntriesByType: (type: string): PerformanceEntryList => {
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

    private chosenInterface: 'entryTypes' | 'types' | null;

    private addType = (type: string) => {
      if (type === 'mark' || type === 'longtask') {
        this.entryTypeSubscribe[type] = true;

        return;
      }

      throw Error('(Error in test case) Types must be "mark" or "longtask"');
    };

    static supportedEntryTypes = ['longtask', 'mark'];

    takeRecords: any;
  }

  return { addPerfEntries, mockPerformanceMark, MockedPerformanceObserver };

  function fireObserver() {
    observersCalls.forEach((c) => c(freshlyAddedTypes));
    freshlyAddedTypes = [];
    perfEntriesSequence = [];
    perfMarkNamesRequested = [];
  }
};
