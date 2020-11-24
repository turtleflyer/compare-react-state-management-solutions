/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render } from '@testing-library/react';
import React from 'react';
import './PerformanceObserver.unsupported.mock';
import type { Retrieve } from './TestComponent';
import { TestComponent } from './TestComponent';

describe('Test usePerfObserver', () => {
  test('unsupported browser throw an error', () => {
    const retrieve: Retrieve = {};

    const { unmount } = render(<TestComponent measureFromCreating {...{ retrieve }} />);
    expect(retrieve.status).toBe('error');

    retrieve.startMeasure!();
    expect(retrieve.status).toBe('error');

    unmount();
  });
});

export {};
