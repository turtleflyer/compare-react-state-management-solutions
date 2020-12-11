import { PerformanceInfo } from 'performance-info';
import React, { CSSProperties, FC } from 'react';
import { connect } from 'react-redux';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { getGridSize } from '../State/selectors';
import type { State } from '../State/StateInterface';

export const ChooseGrid = connect((state: State) => ({ gridSize: getGridSize(state) }))(
  function ChooseGrid({ addStyle = {}, beAwareWhenChosen, gridSize }) {
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
  } as FC<{
    addStyle?: CSSProperties;
    beAwareWhenChosen: ({ gridSize }: { gridSize: number }) => void;
    gridSize: number;
  }>
);
