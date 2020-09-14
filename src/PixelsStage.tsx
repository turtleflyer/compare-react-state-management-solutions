import type { CSSProperties, FC, ReactElement } from 'react';
import React, { memo } from 'react';
import { PixelsLine } from './PixelsLine';
import { HOW_MANY_LINES, LINE_LENGTH } from './State';

const style: CSSProperties = { flexGrow: 1 };

export const PixelsStage: FC = memo(function PixelsStage() {
  let currentLine: ReactElement | null = null;
  for (let i = 0; i < HOW_MANY_LINES; i++) {
    currentLine = (
      <PixelsLine
        {...{ length: LINE_LENGTH, defKeyChoice: ((HOW_MANY_LINES + i + 1) % 2) as 0 | 1 }}
      >
        {currentLine}
      </PixelsLine>
    );
  }

  return <div {...{ style }}>{currentLine}</div>;
});
