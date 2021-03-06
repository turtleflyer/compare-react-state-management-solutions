/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from '@testing-library/react';
import React from 'react';
import './assets/PerformanceObserver.unsupported.mock';
import type { Retrieve } from './assets/TestComponent';
import { TestComponent } from './assets/TestComponent';

describe('Test usePerMetric', () => {
  test('unsupported browser throw an error', () => {
    const retrieve: Retrieve = {};

    const { unmount } = render(<TestComponent measureFromCreated {...{ retrieve }} />);
    expect(retrieve.status).toBe('error');

    retrieve.measurePerformance!();
    expect(retrieve.status).toBe('error');

    unmount();
  });
});

export { };

