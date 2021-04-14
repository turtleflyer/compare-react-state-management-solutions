import { Button } from '@compare-react-state-management-solutions/control-components/Button';
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
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
