import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import type { PixelChoice } from '../State/StateInterface';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: number;
  length: number;
  defChoice: PixelChoice;
}> = ({ children, length, pixelSize, defChoice }) => {
  const [line] = useState(() =>
    Array(length)
      .fill(null)
      .map(() => <ControlPixel {...{ pixelSize, defChoice }} key={getNextKey('c-key')} />)
  );

  return (
    <div>
      <div {...{ style }}>{line}</div>
      {children}
    </div>
  );
};
