/* eslint-disable react-hooks/rules-of-hooks */
import type { SetInterstate } from '@smart-hooks/use-interstate';
import { PerformanceInfo } from '@~internal/performance-info';
import type { UsePerfMetricsReturn } from '@~internal/use-perf-observer';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeAtom,
  getAtom,
  useInterstate,
} from '../State/State';
import type { ColorForAlternativeAtom, PixelChoice } from '../State/StateInterface';
import { rememberActiveChoiceKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useInterstate(...getAtom(rememberActiveChoiceKey)).set();

  type SetColorForAlternativeAtom = SetInterstate<ColorForAlternativeAtom | null>;

  const setAlternativesOfChoices = (alternativeForChoiceKeys.map((key) =>
    useInterstate(...getAtom(key)).set()
  ) as readonly SetColorForAlternativeAtom[]) as readonly [
    SetColorForAlternativeAtom,
    SetColorForAlternativeAtom
  ];
  const perfMeasureAssets = ([0, 1].map(() =>
    usePerfObserver()
  ) as readonly UsePerfMetricsReturn[]) as readonly [UsePerfMetricsReturn, UsePerfMetricsReturn];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();

      setAlternativesOfChoices[evenOrOdd]((prevAtom) => {
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);

          return createColorForAlternativeAtom(evenOrOdd);
        }

        setActiveChoice((1 - evenOrOdd) as PixelChoice);

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
