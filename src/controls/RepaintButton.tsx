/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from '@~internal/control-components/Button';
import { PerformanceInfo } from '@~internal/performance-info';
import { getRandomColor } from '@~internal/random-color';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { alternativeForChoiceKeys, setInterstate } from '../State/State';
import type {
  ColorForAlternativeState,
  PixelChoice,
  RememberActiveChoiceState,
} from '../State/StateInterface';
import { rememberActiveChoiceKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();

    setInterstate((state) => {
      const { [rememberActiveChoiceKey]: activeChoice } = state;
      const { [alternativeForChoiceKeys[activeChoice]]: altKey } = state;
      const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

      return {
        ...(state[alternativeForChoiceKeys[nextPotentialChoice]] === null
          ? ({} as RememberActiveChoiceState)
          : { [rememberActiveChoiceKey]: nextPotentialChoice }),
        ...(altKey === null
          ? ({} as ColorForAlternativeState)
          : { [altKey]: getRandomColor(state[altKey]) }),
      };
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
