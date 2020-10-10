import React, { CSSProperties, FC, useEffect } from 'react';
import { alternativeForChoiceAtoms, useInterstate } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  pixelChoice: ChoiceForPixelAtom;
  defChoice: PixelChoice;
}> = ({ pixelSize, pixelChoice, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choice, setChoice] = useInterstate(...pixelChoice).both();
  const possibleStateAtom = useInterstate(...alternativeForChoiceAtoms[choice]).get();

  useEffect(() => setChoice(defChoice), [defChoice, setChoice]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && <Pixel {...{ altControlAtom: possibleStateAtom }} />}
    </div>
  );
};
