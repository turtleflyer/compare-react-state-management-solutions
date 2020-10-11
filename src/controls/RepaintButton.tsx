import React, { FC, useCallback } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getRandomColor } from '../helpers/randomColor';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';

export const RepaintButton: FC = () => {
  const alternatives = [
    useRecoilValue(alternativeForChoiceAtoms[0]),
    useRecoilValue(alternativeForChoiceAtoms[1]),
  ] as const;
  const setColors = [
    useSetRecoilState(alternatives[0]?.atom ?? colorForAlternativePlaceholderAtom),
    useSetRecoilState(alternatives[1]?.atom ?? colorForAlternativePlaceholderAtom),
  ] as const;
  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);

  const repaintRow: () => void = useCallback(() => {
    setColors[activeChoice]((prevColor) => {
      const nextPotentialChoice = (1 - activeChoice) as PixelChoice;
      if (alternatives[nextPotentialChoice] !== null) {
        setActiveChoice(nextPotentialChoice);
      }
      if (alternatives[activeChoice] !== null) {
        return getRandomColor(prevColor);
      }
      return prevColor;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChoice, ...alternatives, setActiveChoice, ...setColors]);

  return <Button {...{ callback: repaintRow, name: 're-paint' }} />;
};
