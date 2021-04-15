/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from '@~internal/control-components/Button';
import { PerformanceInfo } from '@~internal/performance-info';
import type { UsePerfMetricsReturn } from '@~internal/use-perf-observer';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { switchAlternativeAction } from '../State/actions';
import type { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const DisableEnableButtons: FC = () => {
  const dispatch = useDispatch();
  const perfMeasureAssets = ([0, 1].map(() =>
    usePerfObserver()
  ) as readonly UsePerfMetricsReturn[]) as readonly [UsePerfMetricsReturn, UsePerfMetricsReturn];

  function getEvenOrOddRowSwitch(evenOrOdd: PixelChoice): () => void {
    return () => {
      perfMeasureAssets[evenOrOdd][1]();
      dispatch(switchAlternativeAction(evenOrOdd));
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
