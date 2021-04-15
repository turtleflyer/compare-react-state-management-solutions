/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from '@~internal/control-components/Button';
import { PerformanceInfo } from '@~internal/performance-info';
import type { UsePerfMetricsReturn } from '@~internal/use-perf-observer';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  setInterstate
} from '../State/State';
import type {
  AlternativeForChoiceState,
  ColorForAlternativeState,
  PixelChoice,
  RememberActiveChoiceState
} from '../State/StateInterface';
import { rememberActiveChoiceKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const perfMeasureAssets = [0, 1].map(() => usePerfObserver()) as [
    UsePerfMetricsReturn,
    UsePerfMetricsReturn
  ];

  function getEvenOrOddRowSwitch(choice: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[choice][1]();

      setInterstate((state) => {
        const altForChoiceKey = alternativeForChoiceKeys[choice];
        const colorForAltKey = state[altForChoiceKey];

        if (colorForAltKey) {
          return {
            [altForChoiceKey]: null,
            [rememberActiveChoiceKey]: (1 - choice) as PixelChoice,
          } as ColorForAlternativeState & AlternativeForChoiceState & RememberActiveChoiceState;
        }

        const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(choice);

        return {
          ...colorForAlternativeForChoiceEntry,
          [rememberActiveChoiceKey]: choice,
        };
      });
    };
  }

  return (
    <>
      {['enable/disable even rows', 'enable/disable odd rows'].map((name, i) => {
        const WrapDisplay = perfMeasureAssets[i][0];

        return (
          <div {...{ style: buttonContainerStyle }} key={name}>
            <Button
              {...{
                callback: getEvenOrOddRowSwitch(i as PixelChoice),
                name,
              }}
            />
            <WrapDisplay>
              <PerformanceInfo {...{ data: null }} />
            </WrapDisplay>
          </div>
        );
      })}
    </>
  );
};
