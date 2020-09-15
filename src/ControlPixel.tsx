import type { CSSProperties, FC } from 'react';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Pixel } from './Pixel';
import type { PixelState } from './State';
import { PIXEL_SIZE, sendAtomsControlAtoms, storeAtomsMethods } from './State';

const pixelSizeString = `${PIXEL_SIZE}px`;

const style: CSSProperties = { height: pixelSizeString, width: pixelSizeString };

export const ControlPixel: FC<{
  pixelControlAtom: PixelState;
}> = ({ pixelControlAtom }) => {
  /**
   * Trying to use selector cause an error in developing mode: "Warning: Cannot update a component
   * (`Batcher`) while rendering a different component (`ControlPixel`)."
   */
  const choice = useRecoilValue(pixelControlAtom);
  const possibleStateAtom = useRecoilValue(sendAtomsControlAtoms[choice]);

  useEffect(() => storeAtomsMethods.push(pixelControlAtom), [pixelControlAtom]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && <Pixel {...{ stateAtom: possibleStateAtom.atom }} />}
    </div>
  );
};
