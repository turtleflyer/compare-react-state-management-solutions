import { PerformanceInfo } from 'performance-info';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { getAtom, useInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey, gridSizeKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...getAtom(gridSizeKey)).get();
  const [atomToPaint, setAtomToPaint] = useState({ atom: getAtom(choiceForPixelPlaceholderKey) });
  const paintRandomPixel = useInterstate(...atomToPaint.atom).set();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [paintRandomPixel]);

  function randomPaint() {
    startMeasure();
    setAtomToPaint({ atom: drawPixelToPaint(gridSize ** 2) });
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
