import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from '../reusable-components/Button';
import { repaintRowAction } from '../State/actions';
import { buttonContainerStyle } from './styles';

export const RepaintButton = connect(null, { repaintRow: repaintRowAction })(
  function RepaintButton({ repaintRow }) {
    const [WrapDisplay, startMeasure] = usePerfObserver();

    function repaintCallback() {
      startMeasure();
      repaintRow();
    }

    return (
      <div {...{ style: buttonContainerStyle }}>
        <Button {...{ callback: repaintCallback, name: 're-paint' }} />
        <WrapDisplay>
          <PerformanceInfo {...{ data: null }} />
        </WrapDisplay>
      </div>
    );
  } as FC<{ repaintRow: () => void }>
);
