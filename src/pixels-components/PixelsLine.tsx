import type { CSSProperties, FC, ReactElement } from 'react';
import React, { useMemo } from 'react';
import { getNextKey } from '../helpers/getNextAtom';
import type { PixelChoice } from '../State/StateInterface';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: string;
  length: number;
  defChoice: PixelChoice;
}> = ({ children, length, pixelSize, defChoice }) => {
  const line: ReactElement[] = useMemo(
    () =>
      Array(length)
        .fill(null)
        .map(() => <ControlPixel {...{ pixelSize, defChoice }} key={getNextKey('c-key')} />),
    [defChoice, length, pixelSize]
  );

  return (
    <>
      <div {...{ style }}>{line}</div>
      {children && <div>{children}</div>}
    </>
  );
};
