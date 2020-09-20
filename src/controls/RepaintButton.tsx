import type { FC } from 'react';
import React, { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getRandomColor } from '../helpers/randomColor';
import { Button } from '../reusable-components/Button';
import {
  alternativesControlAtomsState,
  DEF_COLOR,
  placeholderAtomForAlternativesState,
} from '../State/State';
import type { ChoiceStateRecord } from './ChoiceState';

export const RepaintButton: FC<ChoiceStateRecord> = ({ choiceStateRecord }) => {
  interface InnerState {
    colors: { 0: string; 1: string };
  }
  const defInnerState: InnerState = {
    colors: { 0: DEF_COLOR, 1: DEF_COLOR },
  };
  const innerStateRecord = useRef(defInnerState);

  const alternativesControlAtoms = useRecoilValue(alternativesControlAtomsState);

  const setColors = [
    useSetRecoilState(alternativesControlAtoms[0] || placeholderAtomForAlternativesState),
    useSetRecoilState(alternativesControlAtoms[1] || placeholderAtomForAlternativesState),
  ] as const;

  function repaintRow() {
    const {
      current: currentInnerState,
      current: { colors: currentColors },
    } = innerStateRecord;
    const {
      current: choiceState,
      current: { choice: currentChoice },
    } = choiceStateRecord;

    if (alternativesControlAtoms[currentChoice] !== null) {
      const newColor = getRandomColor(currentColors[currentChoice]);
      currentInnerState.colors = { ...currentColors, [currentChoice]: newColor };
      setColors[currentChoice](newColor);
    }

    const nextPotentialChoice = (1 - currentChoice) as 0 | 1;
    if (alternativesControlAtoms[nextPotentialChoice] !== null) {
      choiceState.choice = nextPotentialChoice;
    }
  }

  return <Button {...{ callback: repaintRow, name: 're-paint' }} />;
};
