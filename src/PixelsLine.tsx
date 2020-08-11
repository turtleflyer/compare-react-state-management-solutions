import React, { memo } from 'react';
import type { CSSProperties, FC, ReactElement } from 'react';
import { Pixel } from './Pixel';

const style: CSSProperties = { display: 'flex' };

// eslint-disable-next-line react/display-name
export const PixelsLine: FC<{ length: number; stateKey: string }> = memo(({ length, stateKey }) => {
  const pixelRow: Array<ReactElement> = Array<ReactElement>(length)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .fill(null as any)
    // eslint-disable-next-line react/no-array-index-key
    .map((_, i) => <Pixel {...{ stateKey }} key={i} />);

  return <div {...{ style }}>{pixelRow}</div>;
});
