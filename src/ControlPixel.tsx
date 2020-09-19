import type { CSSProperties, FC } from 'react';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Pixel } from './Pixel';
import type { PixelState } from './State';
import { sendAtomsControlAtoms, storeAtomsMethods } from './State';

export const ControlPixel: FC<{
  pixelSize: string;
  pixelControlAtom: PixelState;
  defKeyChoice: 0 | 1;
}> = ({ pixelSize, pixelControlAtom, defKeyChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };
  /**
   * Trying to use selector cause an error in developing mode: "Warning: Cannot update a component
   * (`Batcher`) while rendering a different component (`ControlPixel`)."
   */
  const [choice, setChoice] = useRecoilState(pixelControlAtom);
  useEffect(() => {
    setChoice(defKeyChoice);
  }, [defKeyChoice, setChoice]);

  const possibleStateAtom = useRecoilValue(sendAtomsControlAtoms[choice]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && <Pixel {...{ stateAtom: possibleStateAtom.atom }} />}
    </div>
  );
};
