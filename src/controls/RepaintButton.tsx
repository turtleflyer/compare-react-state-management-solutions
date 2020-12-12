import { PerformanceInfo } from 'performance-info';
import type { FC } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { usePerfObserver } from 'use-perf-observer';
import { Button } from '../reusable-components/Button';
import { repaintRowAction } from '../State/actions';
import { buttonContainerStyle } from './styles';

export const RepaintButton: FC = () => {
  const dispatch = useDispatch();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function repaintRow() {
    startMeasure();
    dispatch(repaintRowAction());
  }

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button {...{ callback: repaintRow, name: 're-paint' }} />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
