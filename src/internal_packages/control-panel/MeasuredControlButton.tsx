/* eslint-disable react-hooks/rules-of-hooks */
import {
  PerformanceInfo,
  useAddRef,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
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
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric();
  const addRef = useAddRef();

  return (
    <div {...{ style: buttonContainerStyle, ref: addRef }}>
      <Button
        {...{
          onClick: () => {
            measurePerformance();
            onPushButton();
          },
          name,
        }}
      />
      <WrapMetricConsumer>
        <PerformanceInfo {...{ tags: [moduleName, name] }} />
      </WrapMetricConsumer>
    </div>
  );
};
