import React, { memo } from 'react';
import type { CSSProperties, FC, ReactElement } from 'react';
import type { RecoilState } from 'recoil';
import { Pixel } from './Pixel';

const style: CSSProperties = { display: 'flex' };

// eslint-disable-next-line react/display-name
export const PixelsLine: FC<{ length: number; stateAtom: RecoilState<string> }> = memo(
  ({ length, stateAtom }) => {
    const pixelRow: Array<ReactElement> = Array<ReactElement>(length)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .fill(null as any)
      // eslint-disable-next-line react/no-array-index-key
      .map((_, i) => <Pixel {...{ stateAtom }} key={i} />);

    return <div {...{ style }}>{pixelRow}</div>;
  }
);
