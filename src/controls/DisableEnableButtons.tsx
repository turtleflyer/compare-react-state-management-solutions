import type { FC } from 'react';
import React from 'react';
import { useMeasurePerformance } from 'use-measure-perf';
import { Button } from '../reusable-components/Button';
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

  const alternativesState = [
    useInterstate(...alternativeForChoiceAtoms[0]).both(),
    useInterstate(...alternativeForChoiceAtoms[1]).both(),
  ];
  const durations = [
    useMeasurePerformance({ dependencies: [alternativesState[0][0]] }),
    useMeasurePerformance({ dependencies: [alternativesState[1][0]] }),
  ] as const;

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () =>
      alternativesState[evenOrOdd][1]((prevAtom) => {
        if (!prevAtom) {
          setActiveChoice(evenOrOdd);
          return getNextColorForAlternativeAtom(evenOrOdd);
        }
        setActiveChoice((1 - evenOrOdd) as PixelChoice);
        return null;
      });
  }

  return (
    <>
      {['enable/disable even rows', 'enable/disable odd rows'].map((name, i) => (
        <div {...{ style: buttonContainerStyle }} key={name}>
          <Button
            {...{
              callback: getEvenOrOddRowSwitch(i as PixelChoice),
              name,
            }}
          />
          <RenderInfo {...{ duration: durations[i] }} />
        </div>
      ))}
    </>
  );
};
