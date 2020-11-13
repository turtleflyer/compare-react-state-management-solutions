import type { CSSProperties, FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import {
  alternativeForChoiceAtoms,
  DEF_GRID_SIZE,
  getNextColorForAlternativeAtom,
  gridSizeAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const ChooseGrid: FC<{ addStyle?: CSSProperties }> = ({ addStyle = {} }) => {
  const setGridSize = useInterstate(...gridSizeAtom).set();
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setAlternatives = [0, 1].map((i) => useInterstate(...alternativeForChoiceAtoms[i]).set());
  const [WrapDisplay, startMeasure] = usePerfObserver({ measureFromCreating: true });

  function inputCallback(input: string) {
    startMeasure();
    storeAtomsMethods.resetIndex();
    setGridSize(parseInt(input, 10));
    setActiveChoice(0);
    setAlternatives.forEach((set, i) => {
      set((prevAtom) => {
        if (!prevAtom) {
          return getNextColorForAlternativeAtom(i as PixelChoice);
        }
        return prevAtom;
      });
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
};
