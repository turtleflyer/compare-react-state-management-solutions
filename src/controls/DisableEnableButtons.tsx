/* eslint-disable react-hooks/rules-of-hooks */
import { PerformanceInfo } from '@~internal/performance-info';
import type { UsePerfMetricsReturn } from '@~internal/use-perf-observer';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import type { SetterOrUpdater } from 'recoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import {
  alternativeForChoiceAtoms,
  createColorForAlternativeAtom,
  rememberActiveChoiceAtom,
} from '../State/State';
import type { HoldColorForAlternativeAtom, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);

  type ManageAlternativesState = [
    HoldColorForAlternativeAtom,
    SetterOrUpdater<HoldColorForAlternativeAtom | null>
  ];

  const manageAlternativesState = alternativeForChoiceAtoms.map((atom) => useRecoilState(atom)) as [
    ManageAlternativesState,
    ManageAlternativesState
  ];

  const perfMeasureAssets = [0, 1].map(() => usePerfObserver()) as [
    UsePerfMetricsReturn,
    UsePerfMetricsReturn
  ];

  function getEvenOrOddRowSwitch(choice: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[choice][1]();
      const prevAtom = manageAlternativesState[choice][0];

      if (prevAtom) {
        manageAlternativesState[choice][1](null);
        setActiveChoice((1 - choice) as PixelChoice);
      } else {
        manageAlternativesState[choice][1]({
          atom: createColorForAlternativeAtom(choice),
        });
        setActiveChoice(choice);
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
