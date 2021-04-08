/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@~internal/performance-info';
import type { UsePerfMetricsReturn } from '@~internal/use-perf-observer';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeEntry,
  setInterstate,
} from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { rememberActiveChoiceKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const perfMeasureAssets = [0, 1].map(() => usePerfObserver()) as [
    UsePerfMetricsReturn,
    UsePerfMetricsReturn
  ];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();

      setInterstate((state) => {
        const altForChoiceKey = alternativeForChoiceKeys[evenOrOdd];
        const colorForAltKey = state[altForChoiceKey];

        if (colorForAltKey) {
          return {
            [altForChoiceKey]: null,
            [rememberActiveChoiceKey]: (1 - evenOrOdd) as PixelChoice,
          };
        }

        const colorForAlternativeEntry = createColorForAlternativeEntry(evenOrOdd);

        return {
          ...Object.fromEntries([colorForAlternativeEntry]),
          [altForChoiceKey]: colorForAlternativeEntry[0],
          [rememberActiveChoiceKey]: evenOrOdd,
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
