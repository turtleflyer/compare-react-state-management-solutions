import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import type { FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { gridSizeAtom, useInterstate } from '../State/State';
import { PixelChoice } from '../State/StateInterface';
import { PixelsLine } from './PixelsLine';

export const PixelsStage: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();
  const [stageHeight, setStageHeight] = useState(0);

  const lines: ReactElement | null = useSmartMemo(() => {
    if (!stageHeight) {
      return null;
    }

    const pixelSize = `${stageHeight / gridSize}px`;
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

    return currentLine as ReactElement;
  }, [gridSize, stageHeight]);

  const ref = (e: HTMLDivElement | null) => {
    if (e && !stageHeight) {
      const { height } = e.getBoundingClientRect();
      setStageHeight(height);
    }
  };

  return <div {...{ style: { flexGrow: 1 }, ref }}>{lines}</div>;
};
