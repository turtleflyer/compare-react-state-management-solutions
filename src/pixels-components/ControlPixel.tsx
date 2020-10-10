import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { getNextAtom } from '../helpers/getNextAtom';
import {
  alternativeForChoiceAtoms,
  choiceForPixelPlaceholderAtom,
  useInterstate,
} from '../State/State';
import { choiceForPixel, ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [pixelChoice, setPixelChoice] = useState<ChoiceForPixelAtom>(choiceForPixelPlaceholderAtom);
  const [choice, setChoice] = useInterstate(...pixelChoice).both();
  const possibleStateAtom = useInterstate(...alternativeForChoiceAtoms[choice]).get();

  useEffect(() => {
    if (pixelChoice === choiceForPixelPlaceholderAtom) {
      let nextAtom = storeAtomsMethods.getNext();
      if (!nextAtom) {
        nextAtom = getNextAtom(choiceForPixel, defChoice);
        storeAtomsMethods.push(nextAtom);
      }
      setPixelChoice(nextAtom);
    } else {
      setChoice(defChoice);
    }
  }, [defChoice, pixelChoice, setChoice]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && pixelChoice !== choiceForPixelPlaceholderAtom && (
        <Pixel {...{ altControlAtom: possibleStateAtom }} />
      )}
    </div>
  );
};
