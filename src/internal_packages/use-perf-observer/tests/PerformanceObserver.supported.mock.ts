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

export function addPerfEntries(
  entries: PerformanceEntrySimplified[],
  settings: { toFireImmediately: boolean } = { toFireImmediately: false }
): void {
  let { toFireImmediately } = settings;

  perfEntriesSequence = [...perfEntriesSequence, ...entries];
  freshlyAddedTypes = (['mark', 'longtask'] as SelectedEntriesTypes[]).filter(
    (t) => freshlyAddedTypes.includes(t) || entries.some(({ entryType }) => t === entryType)
  );

  if (requestsOnPerfMarkFlag && freshlyAddedTypes.includes('mark')) {
    requestsOnPerfMarkFlag = false;
    toFireImmediately = true;
  }

  if (toFireImmediately) {
    fireObserver();
  }
}

export function mockPerformanceMark(): void {
  requestsOnPerfMarkFlag = true;
}

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

  private chosenInterface: 'entryTypes' | 'types' | undefined;

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

  static supportedEntryTypes = [
    'element',
    'event',
    'first-input',
    'largest-contentful-paint',
    'layout-shift',
    'longtask',
    'mark',
    'measure',
    'navigation',
    'paint',
    'resource',
  ];

  observe(
    settings:
      | { entryTypes: SelectedEntriesTypes[] }
      | { entryTypes?: undefined; type: SelectedEntriesTypes; buffered?: boolean }
  ) {
    if (
      (settings.entryTypes && this.chosenInterface === 'types') ||
      (!settings.entryTypes && this.chosenInterface === 'entryTypes')
    ) {
      throw Error('(Error in test case) Observer call interface may not be changed');
    }

    if (settings.entryTypes) {
      const { entryTypes } = settings;

      this.chosenInterface = 'entryTypes';
      this.disconnect();
      entryTypes.forEach((type) => {
        if (type === 'mark' || type === 'longtask') {
          this.entryTypeSubscribe[type] = true;
          return;
        }

        throw Error('(Error in test case) Types must be "mark" or "longtask"');
      });
    } else {
      this.chosenInterface = 'types';
      this.entryTypeSubscribe[settings.type] = true;
    }
  }

  disconnect() {
    this.entryTypeSubscribe = { mark: false, longtask: false };
  }

  takeRecords: unknown;
}

global.PerformanceObserver = MockedPerformanceObserver as typeof PerformanceObserver;
