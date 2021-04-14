import { DelayedInput } from '@~internal/control-components/DelayedInput';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { readInterstate } from '../State/State';
import { gridSizeKey } from '../State/StateInterface';

export const ChooseGrid: FC<{
  addStyle?: CSSProperties;
  beAwareWhenChosen: ({ gridSize }: { gridSize: number }) => void;
}> = ({ addStyle = {}, beAwareWhenChosen }) => {
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    const nextGridSize = parseInt(input, 10) || readInterstate(gridSizeKey);
    beAwareWhenChosen({ gridSize: nextGridSize });
  }

  return (
    <div {...{ style: addStyle }}>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${readInterstate(gridSizeKey)}`,
          addStyle: { marginBottom: '2px' },
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
