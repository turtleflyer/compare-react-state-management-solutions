/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { Button } from './Button';
import { HookOrNotProp } from './HookOrNotProp';
import { buttonContainerStyle } from './styles';

type MeasuredControlButtonProps = { name: string } & HookOrNotProp<'onPushButton'>;

export const MeasuredControlButton: FC<MeasuredControlButtonProps> = (props) => {
  const onPushButton = props.onPushButton ?? props.useOnPushButton();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button
        {...{
          onClick: () => {
            startMeasure();
            onPushButton();
          },
          name: props.name,
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
