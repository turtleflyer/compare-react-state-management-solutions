import type { FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import type { PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { PixelsLine } from './PixelsLine';

export const PixelsStage: FC<{ pixelSize?: number | null; gridSize?: number | null }> = ({
  pixelSize = null,
  gridSize = null,
}) => {
  const [lines, setLines] = useState<ReactElement | null>(null);

  useEffect(() => {
    if (pixelSize !== null && gridSize !== null) {
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

      storeAtomsMethods.reset();
      setLines(currentLine);
    }
  }, [gridSize, pixelSize]);

  return <>{lines}</>;
};
