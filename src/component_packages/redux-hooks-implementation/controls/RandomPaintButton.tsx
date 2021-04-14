import { Button } from '@~internal/control-components/Button';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { switchPixelChoiceAction } from '../State/actions';
import { getGridSize } from '../State/selectors';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useSelector(getGridSize);
  const dispatch = useDispatch();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  function randomPaint() {
    startMeasure();
    dispatch(switchPixelChoiceAction(drawPixelToPaint(gridSize ** 2)));
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
};
