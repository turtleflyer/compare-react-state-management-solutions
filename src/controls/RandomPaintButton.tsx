import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { switchPixelChoiceAction } from '../State/actions';
import { getGridSize } from '../State/selectors';
import type { ChoiceForPixel, State } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton = connect((state: State) => ({ gridSize: getGridSize(state) }), {
  switchPixelChoice: switchPixelChoiceAction,
})(function RandomPaintButton({ gridSize, switchPixelChoice }) {
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function randomPaint() {
    startMeasure();
    switchPixelChoice(drawPixelToPaint(gridSize ** 2));
  }

  return (
    <div {...{ style: buttonContainerStyle }}>
      <Button
        {...{
          callback: randomPaint,
          name: 'paint random pixel',
        }}
      />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
} as FC<{ gridSize: number; switchPixelChoice: (pixel: ChoiceForPixel) => void }>);
