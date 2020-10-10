import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import { getNextAtom, getNextKey } from '../helpers/getNextAtom';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { choiceForPixel } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { ControlPixel } from './ControlPixel';

const style: CSSProperties = { display: 'flex' };

export const PixelsLine: FC<{
  pixelSize: string;
  length: number;
  defChoice: PixelChoice;
}> = ({ children, length, pixelSize, defChoice }) => {
  const line: ReactElement[] = Array(length)
    .fill(null)
    .map(() => {
      let nextAtom: ChoiceForPixelAtom = storeAtomsMethods.getNext();
      if (!nextAtom) {
        nextAtom = getNextAtom(choiceForPixel, defChoice);
        storeAtomsMethods.push(nextAtom);
      }

      return (
        <ControlPixel
          {...{ pixelSize, pixelChoice: nextAtom, defChoice }}
          key={getNextKey('c-key')}
        />
      );
    });

  return (
    <div>
      <div {...{ style }}>{line}</div>
      {children}
    </div>
  );
};
