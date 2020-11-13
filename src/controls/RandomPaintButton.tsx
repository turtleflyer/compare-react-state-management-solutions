import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useMeasurePerformance } from 'use-measure-perf';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { RenderInfo } from '../reusable-components/RenderInfo';
import { choiceForPixelPlaceholderAtom, gridSizeAtom } from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useSetRecoilState(atomToPaint[0]);
  const duration = useMeasurePerformance({ dependencies: [atomToPaint] });
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
      <RenderInfo {...{ duration }} />
      <WrapDisplay>
        <PerformanceInfo {...{ data: null }} />
      </WrapDisplay>
    </div>
  );
};
