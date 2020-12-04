import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { getAtom, useInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey, gridSizeKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...getAtom(gridSizeKey)).get();
  const [atomToPaint, setAtomToPaint] = useState(getAtom(choiceForPixelPlaceholderKey));
  const paintRandomPixel = useInterstate(...atomToPaint).set();
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [paintRandomPixel, atomToPaint]);

  function randomPaint() {
    startMeasure();
    setAtomToPaint(drawPixelToPaint(gridSize ** 2));
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
