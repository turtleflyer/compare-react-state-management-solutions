import type { FC } from 'react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { DelayedInput } from '../reusable-components/DelayedInput';
import {
  alternativeForChoiceAtoms,
  DEF_GRID_SIZE,
  getNextColorForAlternativeAtom,
  gridSizeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { CarryAtom, ColorForAlternative, PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const ChooseGrid: FC = () => {
  const setGridSize = useSetRecoilState(gridSizeAtom);
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);
  const setAlternatives = [
    useSetRecoilState(alternativeForChoiceAtoms[0]),
    useSetRecoilState(alternativeForChoiceAtoms[1]),
  ] as const;

  function inputCallback(input: string) {
    storeAtomsMethods.resetIndex();
    const gridSize = parseInt(input, 10);
    setGridSize(gridSize);
    setActiveChoice(0);
    setAlternatives.forEach((set, i) => {
      set((prevState) => {
        if (!prevState) {
          return { atom: getNextColorForAlternativeAtom(i as PixelChoice) } as CarryAtom<
            ColorForAlternative
          >;
        }
        return prevState;
      });
    });
  }

  return (
    <DelayedInput {...{ label: 'input grid size: ', inputCallback, value: `${DEF_GRID_SIZE}` }} />
  );
};
