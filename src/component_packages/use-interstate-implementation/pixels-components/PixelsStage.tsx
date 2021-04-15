import type { FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { readInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { gridSizeKey } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { PixelsLine } from './PixelsLine';

export const PixelsStage: FC = () => {
  const [lines, setLines] = useState<ReactElement | null>(null);

  const ref = (e: HTMLDivElement | null) => {
    if (e && !lines) {
      const gridSize = readInterstate(gridSizeKey);
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

      storeKeysMethods.reset();
      setLines(currentLine);
    }
  };

  return <div {...{ style: { flexGrow: 1 }, ref }}>{lines}</div>;
};
