const MockedPerformanceObserver = {
  supportedEntryTypes: ['mark', 'measure', 'navigation', 'resource'],
};

global.PerformanceObserver = (MockedPerformanceObserver as unknown) as typeof PerformanceObserver;

export {};
