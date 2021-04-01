/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from 'performance-info';
import type { FC } from 'react';
import React from 'react';
import type { UsePerfMetricsReturn } from 'use-perf-observer';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeAtom,
  setInterstate,
} from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { rememberActiveChoiceKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const perfMeasureAssets = ([0, 1].map(() =>
    usePerfObserver()
  ) as readonly UsePerfMetricsReturn[]) as readonly [UsePerfMetricsReturn, UsePerfMetricsReturn];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();
      setInterstate(alternativeForChoiceKeys[evenOrOdd], (prevAtom) => {
        if (!prevAtom) {
          setInterstate(rememberActiveChoiceKey, evenOrOdd);
          return createColorForAlternativeAtom(evenOrOdd);
        }

        setInterstate(rememberActiveChoiceKey, (1 - evenOrOdd) as PixelChoice);

        return null;
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
