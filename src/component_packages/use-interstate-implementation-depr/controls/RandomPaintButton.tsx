import { Button } from '@compare-react-state-management-solutions/control-components/Button';
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
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
  }, [paintRandomPixel, atomToPaint]);

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
