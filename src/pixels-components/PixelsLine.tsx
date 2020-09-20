import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import { getNextAtom, getNextKey } from '../helpers/getNextAtom';
import type { PixelState } from '../State/State';
import { pixelControlPrefix } from '../State/State';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { ControlPixel } from './ControlPixel';

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
