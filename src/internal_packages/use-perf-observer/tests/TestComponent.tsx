import type { FC } from 'react';
import React, { StrictMode, useEffect, useState } from 'react';
import type { UsePerfMetricsSettings } from '../PerfMetricsTypes';
import type { Measures, MetricsComponentProps, Status } from '../usePerfObserver';
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

const Inner: FC<{ settings: UsePerfMetricsSettings; retrieve: Retrieve }> = ({
  settings,
  retrieve,
}) => {
  const [Wrap, startMeasure] = usePerfObserver(settings);
  Object.assign(retrieve, { startMeasure });

  return (
    <Wrap>
      <Display {...{ retrieve }} />
    </Wrap>
  );
};

export const TestComponent: FC<{
  measureFromCreating?: boolean;
  name?: string;
  retrieve: Retrieve;
}> = ({ measureFromCreating = false, name, retrieve }) => {
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

  return (
    <StrictMode>
      {start ? <Inner {...{ settings: { measureFromCreating, name }, retrieve }} /> : null}
    </StrictMode>
  );
};
