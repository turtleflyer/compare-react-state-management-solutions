import { getNextKey } from '@~internal/get-next-key';
import type { CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import type { PixelChoice } from '../State/StateInterface';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: string;
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
    <>
      <div {...{ style }}>{line}</div>
      {children && <div>{children}</div>}
    </>
  );
};
