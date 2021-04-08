import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { readInterstate, setInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { gridSizeKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const [WrapDisplay, startMeasure] = usePerfObserver();

  const randomPaint = (): void => {
    startMeasure();
    setInterstate(
      drawPixelToPaint(readInterstate(gridSizeKey) ** 2),
      (prev) => (1 - prev) as PixelChoice
    );
  };

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
