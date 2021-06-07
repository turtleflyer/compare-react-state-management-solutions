import {
  PerformanceInfo,
  useAddRef,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { FC } from 'react';
import React from 'react';
import { Button } from './Button';
import { buttonContainerStyle } from './styles';

export type DisableOrEnableRowsHook = () => (() => void) | undefined;

export const DisableOrEnableRowsButton: FC<{
  useOnPushButton: DisableOrEnableRowsHook;
  name: 'disable odd rows' | 'enable odd rows';
  moduleName: string;
}> = ({ useOnPushButton, name, moduleName }) => {
  const onPushButton = useOnPushButton();
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric();
  const addRef = useAddRef();

  return (
    <div {...{ style: buttonContainerStyle, ref: addRef }}>
      <Button
        {...{
          onClick:
            onPushButton &&
            (() => {
              measurePerformance();
              onPushButton();
            }),
          name,
        }}
      />
      <WrapMetricConsumer>
        <PerformanceInfo {...{ tags: [moduleName, name] }} />
      </WrapMetricConsumer>
    </div>
  );
};
