import { PerformanceInfo } from 'performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { gridSizeAtom, useRefreshApp } from '../State/State';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const ChooseGrid: FC<{
  addStyle?: CSSProperties;
}> = ({ addStyle = {} }) => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [refresher, inputKey] = useRefreshApp();
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    storeAtomsMethods.reset();
    const nextGridSize = parseInt(input, 10) || gridSize;
    refresher({ gridSize: nextGridSize });
  }

  return (
    <div {...{ style: addStyle }}>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${gridSize}`,
          addStyle: { marginBottom: '2px' },
          key: inputKey,
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
