import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useMeasurePerformance } from 'use-measure-perf';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import { choiceForPixelPlaceholderAtom, gridSizeAtom, useInterstate } from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useInterstate(...atomToPaint[0]).set();
  const duration = useMeasurePerformance({ dependencies: [atomToPaint] });

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [paintRandomPixel, atomToPaint]);

  function randomPaint() {
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
      <RenderInfo {...{ duration }} />
    </div>
  );
};
