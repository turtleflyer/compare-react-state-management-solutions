import {
  PerformanceInfo,
  useAddRefToCalculateArea,
  useSetStateToBlock,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { FC } from 'react';
import React from 'react';
import { Button } from './Button';
import { buttonContainerStyle } from './styles';

export type DisableOrEnableRowsHook = () => (() => void) | null;

export const DisableOrEnableRowsButton: FC<{
  useOnPushButton: DisableOrEnableRowsHook;
  name: 'disable rows' | 'enable rows';
  moduleName: string;
}> = ({ useOnPushButton, name, moduleName }) => {
  const onPushButton = useOnPushButton();
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric();
  const addRef = useAddRefToCalculateArea();
  const setStateToBlock = useSetStateToBlock();

  return (
    <div {...{ style: buttonContainerStyle, ref: addRef }}>
      <Button
        {...{
          onClick:
            onPushButton &&
            (() => {
              setStateToBlock();

              measurePerformance({
                measureAtEffectStage: true,

                callback: () => {
                  onPushButton();
                },
              });
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
