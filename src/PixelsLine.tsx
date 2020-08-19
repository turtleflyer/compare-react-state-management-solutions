import React, { memo } from 'react';
import type { CSSProperties, FC, ReactElement } from 'react';
import { pixelControlPrefix } from './constants';
import { ControlPixel } from './ControlPixel';
import { getNextAtom } from './getNextAtom';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  length: number;
  defKeyChoice: 0 | 1;
}> = memo(
  // eslint-disable-next-line prefer-arrow-callback
  function PixelsLine({ children, length, defKeyChoice }) {
    const pixelsRow: Array<ReactElement> = Array<ReactElement>(length)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .fill(null as any)
      .map((_, i) => (
        <ControlPixel
          {...{
            pixelControlAtom: getNextAtom<0 | 1>(pixelControlPrefix, defKeyChoice),
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
  },
  () => true
);
