import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { DelayedInput } from './DelayedInput';
import { HookOrNotProp } from './HookOrNotProp';

export type ChooseGridProps = HookOrNotProp<'gridSize', number> & {
  onGridChosen: (p: { gridSize: number }) => void;
};

export const ChooseGrid: FC<ChooseGridProps> = (props) => {
  const gridSize = props.gridSize ?? props.useGridSize();
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  const inputCallback = (input: string): void => {
    startMeasure();
    const nextGridSize = parseInt(input, 10);
    props.onGridChosen({ gridSize: nextGridSize > 0 ? nextGridSize : gridSize });
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
