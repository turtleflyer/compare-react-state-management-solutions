/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from 'performance-info';
import { getRandomColor } from 'random-color';
import type { FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { alternativeForChoiceKeys, getAtom, setInterstate, useInterstate } from '../State/State';
import type { ColorForAlternativeAtom, PixelChoice } from '../State/StateInterface';
import {
  colorForAlternativePlaceholderKey,
  rememberActiveChoiceKey,
} from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternativesRecord = (alternativeForChoiceKeys.map((key) =>
    useInterstate(...getAtom(key))
  ) as readonly (ColorForAlternativeAtom | null)[]) as readonly [
    ColorForAlternativeAtom | null,
    ColorForAlternativeAtom | null
  ];
  const activeChoice = useInterstate(...getAtom(rememberActiveChoiceKey));
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();
    setInterstate(
      alternativesRecord[activeChoice]?.[0] ?? colorForAlternativePlaceholderKey,
      (prevColor) => {
        const nextPotentialChoice = (1 - activeChoice) as PixelChoice;
        if (alternativesRecord[nextPotentialChoice] !== null) {
          setInterstate(rememberActiveChoiceKey, nextPotentialChoice);
        }
        if (alternativesRecord[activeChoice] !== null) {
          return getRandomColor(prevColor);
        }
        return prevColor;
      }
    );
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
