import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import { ControlPixel } from './ControlPixel';
import { getNextAtom } from './getNextAtom';
import { pixelControlPrefix } from './State';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: string;
  length: number;
  defKeyChoice: 0 | 1;
}> = ({ children, length, pixelSize, defKeyChoice }) => {
  const pixelsRow: ReactElement[] = Array(length)
    .fill(null)
    .map((_, i) => (
      <ControlPixel
        {...{
          pixelSize,
          pixelControlAtom: getNextAtom(pixelControlPrefix, defKeyChoice),
        }}
        // eslint-disable-next-line react/no-array-index-key
        key={i}
      />
    ));

  return (
    <div>
      <div {...{ style }}>{pixelsRow}</div>
      {children}
    </div>
  );
};
