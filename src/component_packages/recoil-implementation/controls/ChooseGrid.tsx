import { DelayedInput } from '@~internal/control-components/DelayedInput';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { gridSizeAtom } from '../State/State';

export const ChooseGrid: FC<{
  addStyle?: CSSProperties;
  beAwareWhenChosen: ({ gridSize }: { gridSize: number }) => void;
}> = ({ addStyle = {}, beAwareWhenChosen }) => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    const nextGridSize = parseInt(input, 10) || gridSize;
    beAwareWhenChosen({ gridSize: nextGridSize });
  }

  return (
    <div {...{ style: addStyle }}>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${gridSize}`,
          addStyle: { marginBottom: '2px' },
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
