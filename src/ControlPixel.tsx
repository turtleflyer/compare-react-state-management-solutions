import type { CSSProperties, FC } from 'react';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Pixel } from './Pixel';
import type { PixelState } from './State';
import { sendAtomsControlAtoms, storeAtomsMethods } from './State';

export const ControlPixel: FC<{
  pixelSize: string;
  pixelControlAtom: PixelState;
}> = ({ pixelSize, pixelControlAtom }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };
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
