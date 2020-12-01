import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { choiceForPixelPlaceholderAtom, gridSizeAtom, useInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useInterstate(...atomToPaint[0]).set();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [paintRandomPixel, atomToPaint]);

  function randomPaint() {
    startMeasure();
    setAtomToPaint([drawPixelToPaint(gridSize ** 2)]);
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
