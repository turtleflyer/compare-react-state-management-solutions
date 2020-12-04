/* eslint-disable react-hooks/rules-of-hooks */
import type { SetInterstate } from '@smart-hooks/use-interstate';
import { PerformanceInfo } from 'performance-info';
import type { FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { UsePerfMetricsReturn } from 'use-perf-observer/PerfMetricsTypes';
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
  const setAlternatives = [0, 1].map((i) =>
    useInterstate(...getAtom(alternativeForChoiceKeys[i])).set()
  ) as [
    SetInterstate<ColorForAlternativeAtom | null>,
    SetInterstate<ColorForAlternativeAtom | null>
  ];
  const perfMeasureAssets = [0, 1].map(() => usePerfObserver()) as [
    UsePerfMetricsReturn,
    UsePerfMetricsReturn
  ];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();
      setAlternatives[evenOrOdd]((prevAtom) => {
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
