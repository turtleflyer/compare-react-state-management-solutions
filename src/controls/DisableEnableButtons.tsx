/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from 'performance-info';
import type { FC } from 'react';
import React from 'react';
import type { SetterOrUpdater } from 'recoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { usePerfObserver } from 'use-perf-observer';
import type { UsePerfMetricsReturn } from 'use-perf-observer/PerfMetricsTypes';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  createColorForAlternativeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type {
  CarryAtom,
  CarryAtomColorForAlternative,
  ColorForAlternative,
  PixelChoice,
} from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);

  type ManageAlternativesState = [
    CarryAtomColorForAlternative,
    SetterOrUpdater<CarryAtomColorForAlternative>
  ];

  const manageAlternativesState = (alternativeForChoiceAtoms.map((atom) =>
    useRecoilState(atom)
  ) as readonly ManageAlternativesState[]) as readonly [
    ManageAlternativesState,
    ManageAlternativesState
  ];
  const perfMeasureAssets = ([0, 1].map(() =>
    usePerfObserver()
  ) as readonly UsePerfMetricsReturn[]) as readonly [UsePerfMetricsReturn, UsePerfMetricsReturn];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      const prevAtom = manageAlternativesState[evenOrOdd][0];

      perfMeasureAssets[evenOrOdd][1]();

      if (!prevAtom) {
        setActiveChoice(evenOrOdd);
        manageAlternativesState[evenOrOdd][1]({
          atom: createColorForAlternativeAtom(evenOrOdd),
        } as CarryAtom<ColorForAlternative>);
      } else {
        setActiveChoice((1 - evenOrOdd) as PixelChoice);
        manageAlternativesState[evenOrOdd][1](null);
      }
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
