import { act, render } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';
import { defineSettings, useMeasurePerformance } from '../useMeasurePerformance';

describe('Test useMeasurePerformance', () => {
  test('working properly', async () => {
    let performanceNowSequence: number[] = [];
    let performanceNowIndex = 0;

    performance.now = () => {
      if (performanceNowIndex < performanceNowSequence.length) {
        return performanceNowSequence[performanceNowIndex++];
      }
      return Performance.prototype.now.call(performance);
    };

    function runPerfNowSeq(seq: number[]) {
      performanceNowSequence = seq;
      performanceNowIndex = 0;
      performanceNowSequence.forEach(() => jest.runOnlyPendingTimers());
    }

    jest.useFakeTimers();

    let duration!: number | null;

    const TestComponent: FC<{ r: boolean }> = ({ r }) => {
      duration = useMeasurePerformance({ dependencies: [r] });

      return <></>;
    };

    defineSettings({ thresholdToEndorseInterval: 10, gapIntervalMultiFactor: 1 });

    performanceNowSequence.push(2);
    const { unmount, rerender } = render(<TestComponent {...{ r: true }} />);

    await act(async () => {
      runPerfNowSeq([3, 5, 11, 15, 17, 22, 27]);
    });
    expect(duration).toBe(0);

    runPerfNowSeq([28, 29, 33]);
    performanceNowSequence.push(36);
    rerender(<TestComponent {...{ r: false }} />);

    await act(async () => {
      runPerfNowSeq([37, 38, 45, 49]);
    });
    expect(duration).toBe(0);

    runPerfNowSeq([65, 66, 67]);
    performanceNowSequence.push(67);
    rerender(<TestComponent {...{ r: true }} />);

    await act(async () => {
      runPerfNowSeq([88, 89, 93, 98, 120, 135, 144, 200, 209, 211]);
    });
    expect(duration).toBe(151);

    rerender(<TestComponent {...{ r: true }} />);

    runPerfNowSeq([228, 240, 245, 251]);
    expect(duration).toBe(151);

    runPerfNowSeq([252, 254]);
    performanceNowSequence.push(258);
    rerender(<TestComponent {...{ r: false }} />);

    await act(async () => {
      runPerfNowSeq([260, 262, 270, 288, 300, 305, 311]);
    });
    expect(duration).toBe(0);

    runPerfNowSeq([315]);
    performanceNowSequence.push(317);
    rerender(<TestComponent {...{ r: true }} />);

    await act(async () => {
      runPerfNowSeq([320, 322, 325, 400, 500, 503, 513]);
    });
    expect(duration).toBe(175);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    unmount!();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete performance.now;
  });
});

export {};
