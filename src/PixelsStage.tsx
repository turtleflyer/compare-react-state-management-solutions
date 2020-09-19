import { useSmartMemo } from '@smart-hooks/use-smart-memo';
import { useSmartRef } from '@smart-hooks/use-smart-ref';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PixelsLine } from './PixelsLine';
import { gridSizeState, storeAtomsMethods } from './State';

const style: CSSProperties = { flexGrow: 1 };

export const PixelsStage: FC = () => {
  const gridSize = useRecoilValue(gridSizeState);

  const [stageHeight, setStageHeight] = useState(0);

  const lines: ReactElement | null = useSmartMemo(() => {
    if (!stageHeight) {
      return null;
    }

    storeAtomsMethods.resetIndex();

    const pixelSize = `${stageHeight / gridSize}px`;

    let currentLine: ReactElement | null = null;
    for (let i = 0; i < gridSize; i++) {
      currentLine = (
        <PixelsLine
          {...{
            length: gridSize,
            pixelSize,
            defKeyChoice: ((gridSize + i + 1) % 2) as 0 | 1,
          }}
        >
          {currentLine}
        </PixelsLine>
      );
    }

    return currentLine as ReactElement;
  }, [gridSize, stageHeight]);

  const ref = useSmartRef((e) => {
    const { height } = e.getBoundingClientRect();
    setStageHeight(height);
  });

  return <div {...{ style, ref }}>{lines}</div>;
};
