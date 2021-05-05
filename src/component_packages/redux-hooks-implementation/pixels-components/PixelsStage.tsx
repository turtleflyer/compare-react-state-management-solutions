import type { FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getGridSize } from '../State/selectors';
import type { PixelChoice } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { PixelsLine } from './PixelsLine';

export const PixelsStage: FC<{ provideRef: (ref: HTMLElement) => void }> = ({ provideRef }) => {
  const gridSize = useSelector(getGridSize);
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

      storeKeysMethods.reset();
      setLines(currentLine);
      provideRef(e);
    }
  };

  return <div {...{ style: { flexGrow: 1 }, ref }}>{lines}</div>;
};
