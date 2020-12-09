import type { FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { gridSizeAtom } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { PixelsLine } from './PixelsLine';

export const PixelsStage: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [lines, setLines] = useState<ReactElement | null>(null);

  const ref = (e: HTMLDivElement | null) => {
    if (e && !lines) {
      const { height } = e.getBoundingClientRect();
      const pixelSize = `${height / gridSize}px`;
      let currentLine: ReactElement | null = null;

      for (let i = 0; i < gridSize; i++) {
        currentLine = (
          <PixelsLine
            {...{
              length: gridSize,
              pixelSize,
              defChoice: ((gridSize + i + 1) % 2) as PixelChoice,
            }}
          >
            {currentLine}
          </PixelsLine>
        );
      }

      setLines(currentLine);
    }
  };

  return <div {...{ style: { flexGrow: 1 }, ref }}>{lines}</div>;
};
