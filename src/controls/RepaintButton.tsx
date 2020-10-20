import type { FC } from 'react';
import React, { useState } from 'react';
import { getRandomColor } from '../helpers/randomColor';
import { useMeasurePerformance } from '../perf-measure/useMeasurePerformance';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternativesRecord = [
    useInterstate(...alternativeForChoiceAtoms[0]).get(),
    useInterstate(...alternativeForChoiceAtoms[1]).get(),
  ] as const;

  const setColors = [
    useInterstate(...(alternativesRecord[0] ?? colorForAlternativePlaceholderAtom)).set(),
    useInterstate(...(alternativesRecord[1] ?? colorForAlternativePlaceholderAtom)).set(),
  ];
  const [activeChoice, setActiveChoice] = useInterstate(...rememberActiveChoiceAtom).both();

  const [recalculateDuration, triggerRecalculation] = useState(true);
  const duration = useMeasurePerformance({ dependencies: [recalculateDuration] });

  function repaintRow() {
    triggerRecalculation((v) => !v);
    setColors[activeChoice]((prevColor) => {
      const nextPotentialChoice = (1 - activeChoice) as PixelChoice;
      if (alternativesRecord[nextPotentialChoice] !== null) {
        setActiveChoice(nextPotentialChoice);
      }
      if (alternativesRecord[activeChoice] !== null) {
        return getRandomColor(prevColor);
      }
      return prevColor;
    });
  }

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button {...{ callback: repaintRow, name: 're-paint' }} />
      <RenderInfo {...{ duration }} />
    </div>
  );
};
