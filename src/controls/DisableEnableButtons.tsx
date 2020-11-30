/* eslint-disable react-hooks/rules-of-hooks */
import type { FC } from 'react';
import React from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();

  const alternativesState = [0, 1].map((i) => useInterstate(...alternativeForChoiceAtoms[i]).set());
  const perfMeasureAssets = [0, 1].map(() => usePerfObserver());

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();
      alternativesState[evenOrOdd]((prevAtom) => {
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);
          return getNextColorForAlternativeAtom(evenOrOdd);
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
