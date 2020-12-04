import { PerformanceInfo } from 'performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { rememberActiveChoiceAction, turnOnAlternativeAction } from '../State/actions';
import { DEF_GRID_SIZE } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';

export const ChooseGrid = connect(null, {
  setActiveChoice: rememberActiveChoiceAction,
  setAlternative: turnOnAlternativeAction,
})(function ChooseGrid({
  addStyle = {},
  commandToCreateFreshStore,
  setActiveChoice,
  setAlternative,
}) {
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    storeKeysMethods.reset();
    const gridSize = parseInt(input, 10);
    commandToCreateFreshStore(gridSize);
    setActiveChoice(0);
    [0, 1].forEach((c) => {
      setAlternative(c as PixelChoice);
    });
  }

  return (
    <div {...{ style: addStyle }}>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${DEF_GRID_SIZE}`,
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
  commandToCreateFreshStore: (gridSize: number) => void;
  setActiveChoice: (activeChoice: PixelChoice) => void;
  setAlternative: (alternativeOfChoice: PixelChoice) => void;
}>);
