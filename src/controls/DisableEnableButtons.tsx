import type { SetInterstate } from '@smart-hooks/use-interstate';
import type { FC } from 'react';
import React from 'react';
import { useMeasurePerformance } from '../perf-measure/useMeasurePerformance';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
  useInterstate,
} from '../State/State';
import type { ColorForAlternativeAtom, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useInterstate(...rememberActiveChoiceAtom).set();

  type AlternativesState = readonly [
    readonly [ColorForAlternativeAtom | null, ColorForAlternativeAtom | null],
    readonly [
      SetInterstate<ColorForAlternativeAtom | null>,
      SetInterstate<ColorForAlternativeAtom | null>
    ]
  ];
  const alternativesState = [
    useInterstate(...alternativeForChoiceAtoms[0]).both(),
    useInterstate(...alternativeForChoiceAtoms[1]).both(),
  ].reduce(
    (acc, [v, setV]) => {
      return ([
        [...acc[0], v],
        [...acc[1], setV],
      ] as unknown) as AlternativesState;
    },
    ([[], []] as unknown) as AlternativesState
  );
  const durations = [
    useMeasurePerformance({ dependencies: [alternativesState[0][0]] }),
    useMeasurePerformance({ dependencies: [alternativesState[0][1]] }),
  ] as const;

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () =>
      alternativesState[1][evenOrOdd]((prevAtom) => {
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
