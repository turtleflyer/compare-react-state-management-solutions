import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import { ControlPixel } from './ControlPixel';
import { getNextAtom, getNextKey } from './getNextAtom';
import type { PixelState } from './State';
import { pixelControlPrefix, storeAtomsMethods } from './State';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: string;
  length: number;
  defKeyChoice: 0 | 1;
}> = ({ children, length, pixelSize, defKeyChoice }) => {
  const pixelsAtoms: PixelState[] = Array(length)
    .fill(null)
    .map(() => {
      let nextAtom: PixelState = storeAtomsMethods.getNext();
      if (!nextAtom) {
        nextAtom = getNextAtom(pixelControlPrefix, defKeyChoice);

        storeAtomsMethods.push(nextAtom);
      }

      return nextAtom;
    });

  const line: ReactElement[] = pixelsAtoms.map((pixelControlAtom) => (
    <ControlPixel {...{ pixelSize, pixelControlAtom, defKeyChoice }} key={getNextKey('c-key')} />
  ));

  return (
    <div>
      <div {...{ style }}>{line}</div>
      {children}
    </div>
  );
};
