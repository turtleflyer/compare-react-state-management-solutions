import { getNextKey } from 'get-next-key';
import { PerformanceInfo } from 'performance-info';
import React, { CSSProperties, FC, useState } from 'react';
import { connect } from 'react-redux';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { getGridSize } from '../State/selectors';
import type { State } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';

const refreshKeyPlaceholder = 'refresh-input';

export const ChooseGrid = connect((state: State) => ({ gridSize: getGridSize(state) }))(
  function ChooseGrid({ addStyle = {}, beAwareWhenChosen, gridSize }) {
    const [refreshKey, generateRefreshKey] = useState(() => getNextKey(refreshKeyPlaceholder));
    const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

    function inputCallback(input: string) {
      startMeasure();
      storeKeysMethods.reset();
      const nextGridSize = parseInt(input, 10) || gridSize;
      beAwareWhenChosen(nextGridSize);
      generateRefreshKey(getNextKey(refreshKeyPlaceholder));
    }

    return (
      <div {...{ style: addStyle }}>
        <DelayedInput
          {...{
            label: 'input grid size: ',
            inputCallback,
            value: `${gridSize}`,
            addStyle: { marginBottom: '2px' },
            key: refreshKey,
          }}
        />
        <WrapDisplay>
          <PerformanceInfo {...{ data: null }} />
        </WrapDisplay>
      </div>
    );
  } as FC<{
    addStyle?: CSSProperties;
    beAwareWhenChosen: (gridSize: number) => void;
    gridSize: number;
  }>
);
