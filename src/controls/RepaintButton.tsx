import React, { FC, useCallback } from 'react';
import { getRandomColor } from '../helpers/randomColor';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';

export const RepaintButton: FC = () => {
  const alternativesRecord = [
    useInterstate(...alternativeForChoiceAtoms[0]).get(),
    useInterstate(...alternativeForChoiceAtoms[1]).get(),
  ] as const;
  const setColors = [
    useInterstate(...(alternativesRecord[0] ?? colorForAlternativePlaceholderAtom)).set(),
    useInterstate(...(alternativesRecord[1] ?? colorForAlternativePlaceholderAtom)).set(),
  ] as const;
  const [activeChoice, setActiveChoice] = useInterstate(...rememberActiveChoiceAtom).both();

  const repaintRow: () => void = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChoice, ...alternativesRecord, setActiveChoice, ...setColors]);

  return <Button {...{ callback: repaintRow, name: 're-paint' }} />;
};
