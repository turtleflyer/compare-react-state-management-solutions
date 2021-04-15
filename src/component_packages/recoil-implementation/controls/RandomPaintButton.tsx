import { Button } from '@compare-react-state-management-solutions/control-components/Button';
import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { choiceForPixelPlaceholderAtom, gridSizeAtom } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

export const RandomPaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [atomToPaint, setAtomToPaint] = useState({ atom: choiceForPixelPlaceholderAtom });
  const paintRandomPixel = useSetRecoilState(atomToPaint.atom);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [paintRandomPixel]);

  const randomPaint = (): void => {
    startMeasure();
    setAtomToPaint({ atom: drawPixelToPaint(gridSize ** 2) });
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
