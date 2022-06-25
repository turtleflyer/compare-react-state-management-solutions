import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { PixelChoice } from '../State/StateInterface';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine = ({
  children,
  length,
  pixelSize,
  defChoice,
}: {
  pixelSize: number;
  length: number;
  defChoice: PixelChoice;
  children: React.ReactNode;
}) => {
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
