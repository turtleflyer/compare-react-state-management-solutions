import { useSmartRef } from '@smart-hooks/use-smart-ref';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { useState } from 'react';
import { PixelsLine } from './PixelsLine';
import { SQUARE_SIZE } from './State';

const style: CSSProperties = { flexGrow: 1 };

export const PixelsStage: FC = () => {
  const [lines, setLines] = useState<ReactElement>();

  const ref = useSmartRef((e) =>
    setLines(() => {
      const { height } = e.getBoundingClientRect();
      const pixelSize = `${height / SQUARE_SIZE}px`;

      let currentLine: ReactElement | null = null;
      for (let i = 0; i < SQUARE_SIZE; i++) {
        currentLine = (
          <PixelsLine
            {...{
              length: SQUARE_SIZE,
              pixelSize,
              defKeyChoice: ((SQUARE_SIZE + i + 1) % 2) as 0 | 1,
            }}
          >
            {currentLine}
          </PixelsLine>
        );
      }

      return currentLine as ReactElement;
    })
  );

  return <div {...{ style, ref }}>{lines}</div>;
};
