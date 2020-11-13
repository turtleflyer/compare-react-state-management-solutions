/* eslint-disable react-hooks/rules-of-hooks */
import type { FC } from 'react';
import React from 'react';
import { useMeasurePerformance } from 'use-measure-perf';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { RenderInfo } from '../reusable-components/RenderInfo';
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

  const alternativesState = [0, 1].map((i) =>
    useInterstate(...alternativeForChoiceAtoms[i]).both()
  );
  const durations = [0, 1].map((i) =>
    useMeasurePerformance({ dependencies: [alternativesState[i][0]] })
  );
  const perfMeasureAssets = [0, 1].map(() => usePerfObserver());

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();
      alternativesState[evenOrOdd][1]((prevAtom) => {
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
            <RenderInfo {...{ duration: durations[i] }} />
            <WrapDisplay>
              <PerformanceInfo {...{ data: null }} />
            </WrapDisplay>
          </div>
        );
      })}
    </>
  );
};
