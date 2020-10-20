import type { SetInterstate } from '@smart-hooks/use-interstate';
import type { FC } from 'react';
import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMeasurePerformance } from '../perf-measure/useMeasurePerformance';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import {
  alternativeForChoiceAtoms,
  getNextColorForAlternativeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { CarryAtom, ColorForAlternative, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);

  type AlternativesState = readonly [
    readonly [CarryAtom<ColorForAlternative> | null, CarryAtom<ColorForAlternative> | null],
    readonly [
      SetInterstate<CarryAtom<ColorForAlternative> | null>,
      SetInterstate<CarryAtom<ColorForAlternative> | null>
    ]
  ];
  const alternativesState = [
    useRecoilState(alternativeForChoiceAtoms[0]),
    useRecoilState(alternativeForChoiceAtoms[1]),
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
    return () => {
      const prevAtom = alternativesState[0][evenOrOdd];

      if (!prevAtom) {
        setActiveChoice(evenOrOdd);
        alternativesState[1][evenOrOdd]({
          atom: getNextColorForAlternativeAtom(evenOrOdd),
        } as CarryAtom<ColorForAlternative>);
      } else {
        setActiveChoice((1 - evenOrOdd) as PixelChoice);
        alternativesState[1][evenOrOdd](null);
      }
    };
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
