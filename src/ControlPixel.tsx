import React, { memo, useEffect } from 'react';
import type { CSSProperties, FC } from 'react';
import { useRecoilValue } from 'recoil';
import type { RecoilState } from 'recoil';
import { carryAtomsControlAtoms, PIXEL_SIZE, storeAtomsMethods } from './constants';
import { Pixel } from './Pixel';

const pixelSizeString = `${PIXEL_SIZE}px`;

const style: CSSProperties = { height: pixelSizeString, width: pixelSizeString };

export const ControlPixel: FC<{
  pixelControlAtom: RecoilState<0 | 1>;
  // eslint-disable-next-line prefer-arrow-callback
}> = memo(function ControlPixel({ pixelControlAtom }) {
  /**
   * Trying to use selector cause an error in developing mode: "Warning: Cannot update a component
   * (`Batcher`) while rendering a different component (`ControlPixel`)."
   */
  const choice = useRecoilValue(pixelControlAtom);
  const possibleStateAtom = useRecoilValue(carryAtomsControlAtoms[choice]);

  useEffect(() => storeAtomsMethods.push(pixelControlAtom), []);

  return (
    <div {...{ style }}>
      {possibleStateAtom === null ? null : <Pixel {...{ stateAtom: possibleStateAtom.atom }} />}
    </div>
  );
});
