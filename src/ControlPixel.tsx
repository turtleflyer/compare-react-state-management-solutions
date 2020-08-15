import React, { memo } from 'react';
import type { FC } from 'react';
import { useRecoilValue } from 'recoil';
import type { RecoilState } from 'recoil';
import { carryAtomsControlAtoms } from './constants';
import { Pixel } from './Pixel';

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

  return possibleStateAtom && <Pixel {...{ stateAtom: possibleStateAtom.atom }} />;
});
