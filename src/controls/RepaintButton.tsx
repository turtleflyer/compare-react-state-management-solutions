/* eslint-disable react-hooks/rules-of-hooks */
import type { SetInterstate } from '@smart-hooks/use-interstate';
import { PerformanceInfo } from 'performance-info';
import { getRandomColor } from 'random-color';
import type { FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { alternativeForChoiceKeys, getAtom, useInterstate } from '../State/State';
import type { ColorForAlternativeAtom, ColorValue, PixelChoice } from '../State/StateInterface';
import {
  colorForAlternativePlaceholderKey,
  rememberActiveChoiceKey,
} from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternativesRecord = [0, 1].map((i) =>
    useInterstate(...getAtom(alternativeForChoiceKeys[i])).get()
  ) as [ColorForAlternativeAtom | null, ColorForAlternativeAtom | null];
  const setColors = [0, 1].map((i) =>
    useInterstate(...(alternativesRecord[i] ?? getAtom(colorForAlternativePlaceholderKey))).set()
  ) as [SetInterstate<ColorValue>, SetInterstate<ColorValue>];
  const [activeChoice, setActiveChoice] = useInterstate(...getAtom(rememberActiveChoiceKey)).both();
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
