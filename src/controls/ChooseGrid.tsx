import type { FC } from 'react';
import React from 'react';
import { useMeasurePerformance } from 'use-measure-perf';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { RenderInfo } from '../reusable-components/RenderInfo';
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

export const ChooseGrid: FC = () => {
  const [gridSize, setGridSize] = useInterstate(...gridSizeAtom).both();
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();
  const setAlternatives = [
    useInterstate(...alternativeForChoiceAtoms[0]).set(),
    useInterstate(...alternativeForChoiceAtoms[1]).set(),
  ] as const;
  const duration = useMeasurePerformance({ dependencies: [gridSize] });

  function inputCallback(input: string) {
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
    <div>
      <DelayedInput
        {...{
          label: 'input grid size: ',
          inputCallback,
          value: `${DEF_GRID_SIZE}`,
          addStyle: { marginBottom: '2px' },
        }}
      />
      <RenderInfo {...{ duration }} />
    </div>
  );
};
