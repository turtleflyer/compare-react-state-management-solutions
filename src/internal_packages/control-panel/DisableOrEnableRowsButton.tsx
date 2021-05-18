import {
  PerformanceInfo,
  useAddRef,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
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
  const [WrapDisplay, startMeasure] = usePerfObserver();
  const addRef = useAddRef();

  return (
    <div {...{ style: buttonContainerStyle, ref: addRef }}>
      <Button
        {...{
          onClick:
            onPushButton &&
            (() => {
              startMeasure();
              onPushButton();
            }),
          name,
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ tags: [moduleName, name] }} />
      </WrapDisplay>
    </div>
  );
};
