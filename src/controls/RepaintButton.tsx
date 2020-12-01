/* eslint-disable react-hooks/rules-of-hooks */
import { getRandomColor } from 'random-color';
import type { FC } from 'react';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternatives = [0, 1].map((i) => useRecoilValue(alternativeForChoiceAtoms[i]));
  const colorsState = [0, 1].map((i) =>
    useRecoilState(alternatives[i]?.atom ?? colorForAlternativePlaceholderAtom)
  );
  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);

  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();
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
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
