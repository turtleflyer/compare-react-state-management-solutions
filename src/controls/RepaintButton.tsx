/* eslint-disable react-hooks/rules-of-hooks */
import type { FC } from 'react';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMeasurePerformance } from 'use-measure-perf';
import { usePerfObserver } from 'use-perf-observer';
import { getRandomColor } from '../helpers/randomColor';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  colorForAlternativePlaceholderAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const alternatives = [0, 1].map((i) => useRecoilValue(alternativeForChoiceAtoms[i]));
  const colorsState = [0, 1].map((i) =>
    useRecoilState(alternatives[i]?.atom ?? colorForAlternativePlaceholderAtom)
  );
  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);

  const [recalculateDuration, triggerRecalculation] = useState(true);
  const duration = useMeasurePerformance({ dependencies: [recalculateDuration] });
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();
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
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
