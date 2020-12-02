import type { FC } from 'react';
import React, { StrictMode, useEffect, useState } from 'react';
import { Measures, Status } from '../PerfMetricsTypes';
import type { MetricsComponentProps } from '../usePerfObserver';
import { usePerfObserver } from '../usePerfObserver';

export interface Retrieve {
  startMeasure?: () => void;
  data?: Measures | null;
  status?: Status;
}

const Display: FC<MetricsComponentProps & { retrieve: Retrieve }> = ({
  data,
  status = 'never',
  retrieve,
}) => {
  Object.assign(retrieve, { data, status });

  return <></>;
};

const Inner: FC<{ measureFromCreating: boolean; retrieve: Retrieve }> = ({
  measureFromCreating,
  retrieve,
}) => {
  const [Wrap, startMeasure] = usePerfObserver({ measureFromCreating });
  Object.assign(retrieve, { startMeasure });

  return (
    <Wrap>
      <Display {...{ data: null, retrieve }} />
    </Wrap>
  );
};

export const TestComponent: FC<{ measureFromCreating?: boolean; retrieve: Retrieve }> = ({
  measureFromCreating = false,
  retrieve,
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

  return <StrictMode>{start ? <Inner {...{ measureFromCreating, retrieve }} /> : null}</StrictMode>;
};
