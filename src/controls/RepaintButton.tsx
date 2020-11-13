/* eslint-disable react-hooks/rules-of-hooks */
import type { FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { getRandomColor } from '../helpers/randomColor';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternativesRecord = [0, 1].map((i) =>
    useInterstate(...alternativeForChoiceAtoms[i]).get()
  );

  const setColors = [0, 1].map((i) =>
    useInterstate(...(alternativesRecord[i] ?? colorForAlternativePlaceholderAtom)).set()
  );
  const [activeChoice, setActiveChoice] = useInterstate(...rememberActiveChoiceAtom).both();

  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();
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
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
