import type { FC } from 'react';
import React from 'react';
import { DelayedInput } from '../reusable-components/DelayedInput';
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
  const setGridSize = useInterstate(...gridSizeAtom).set();
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();
  const setAlternatives = [
    useInterstate(...alternativeForChoiceAtoms[0]).set(),
    useInterstate(...alternativeForChoiceAtoms[1]).set(),
  ] as const;

  function inputCallback(input: string) {
    storeAtomsMethods.resetIndex();
    const gridSize = parseInt(input, 10);
    setGridSize(gridSize);
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
    <DelayedInput {...{ label: 'input grid size: ', inputCallback, value: `${DEF_GRID_SIZE}` }} />
  );
};
