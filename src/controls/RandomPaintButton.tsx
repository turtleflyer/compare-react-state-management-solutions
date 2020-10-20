import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { useMeasurePerformance } from '../perf-measure/useMeasurePerformance';
import { Button } from '../reusable-components/Button';
import { RenderInfo } from '../reusable-components/RenderInfo';
import { choiceForPixelPlaceholderAtom, gridSizeAtom, useInterstate } from '../State/State';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useInterstate(...atomToPaint[0]).set();
  const duration = useMeasurePerformance({ dependencies: [atomToPaint] });

  useEffect(() => paintRandomPixel((prev) => (1 - prev) as 0 | 1), [paintRandomPixel, atomToPaint]);

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
