/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { Button } from './Button';
import { buttonContainerStyle } from './styles';

export const MeasuredControlButton: FC<{ name: string; onPushButton: () => void }> = ({
  name,
  onPushButton,
}) => {
  const [WrapDisplay, startMeasure] = usePerfObserver();

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button
        {...{
          callback: () => {
            startMeasure();
            onPushButton();
          },
          name,
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
