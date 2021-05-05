/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { Button } from './Button';
import { HookOrNotProp } from './HookOrNotProp';
import { buttonContainerStyle } from './styles';

type MeasuredControlButtonProps = {
  name: string;
  moduleName: string;
} & HookOrNotProp<'onPushButton'>;

export const MeasuredControlButton: FC<MeasuredControlButtonProps> = (props) => {
  const { name, moduleName } = props;
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
          name,
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ tags: [moduleName, name] }} />
      </WrapDisplay>
    </div>
  );
};
