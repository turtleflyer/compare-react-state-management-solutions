import type { FC } from 'react';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getRandomColor } from '../helpers/randomColor';
import { useMeasurePerformance } from '../perf-measure/useMeasurePerformance';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternatives = [
    useRecoilValue(alternativeForChoiceAtoms[0]),
    useRecoilValue(alternativeForChoiceAtoms[1]),
  ] as const;
  const colorsState = [
    useRecoilState(alternatives[0]?.atom ?? colorForAlternativePlaceholderAtom),
    useRecoilState(alternatives[1]?.atom ?? colorForAlternativePlaceholderAtom),
  ] as const;
  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);

  const [recalculateDuration, triggerRecalculation] = useState(true);
  const duration = useMeasurePerformance({ dependencies: [recalculateDuration] });

  function repaintRow() {
    triggerRecalculation((v) => !v);
    const prevColor = colorsState[activeChoice][0];
    const nextPotentialChoice = (1 - activeChoice) as PixelChoice;
    if (alternatives[nextPotentialChoice] !== null) {
      setActiveChoice(nextPotentialChoice);
    }
    if (alternatives[activeChoice] !== null) {
      colorsState[activeChoice][1](getRandomColor(prevColor));
    }
  }

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button {...{ callback: repaintRow, name: 're-paint' }} />
      <RenderInfo {...{ duration }} />
    </div>
  );
};
