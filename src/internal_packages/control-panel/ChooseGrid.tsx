import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { DelayedInput } from './DelayedInput';

export interface ChooseGridProps {
  gridSize: number;
  onGridChosen: (p: { gridSize: number }) => void;
}

export const ChooseGrid: FC<ChooseGridProps> = ({ gridSize, onGridChosen }) => {
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  const inputCallback = (input: string): void => {
    startMeasure();
    const nextGridSize = parseInt(input, 10);
    nextGridSize > 0 && onGridChosen({ gridSize: nextGridSize });
  };

  return (
    <div>
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
