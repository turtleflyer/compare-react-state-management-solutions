/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@~internal/performance-info';
import { getRandomColor } from '@~internal/random-color';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import type { SetterOrUpdater } from 'recoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { ColorValue, HoldColorForAlternativeAtom, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternatives = alternativeForChoiceAtoms.map((atom) => useRecoilValue(atom)) as [
    HoldColorForAlternativeAtom,
    HoldColorForAlternativeAtom
  ];

  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);

  type ManageColorsState = [ColorValue, SetterOrUpdater<ColorValue>];

  const colorsState = [0, 1].map((i) =>
    useRecoilState(alternatives[i]?.atom ?? colorForAlternativePlaceholderAtom)
  ) as [ManageColorsState, ManageColorsState];

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
