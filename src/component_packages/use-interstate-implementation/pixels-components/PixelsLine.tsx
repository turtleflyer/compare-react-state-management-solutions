import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import type { PixelChoice } from '../State/StateInterface';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: number;
  length: number;
  defChoice: PixelChoice;
}> = ({ children, length, pixelSize, defChoice }) => {
  const [line, setLine] = useState<ReactElement[] | null>(null);

  useEffect(() => {
    const evalLine = Array(length)
      .fill(null)
      .map(() => <ControlPixel {...{ pixelSize, defChoice }} key={getNextKey('c-key')} />);

    setLine(evalLine);
  }, [defChoice, length, pixelSize]);

  return (
    <div>
      <div {...{ style }}>{line}</div>
      {children}
    </div>
  );
};
