import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import { alternativeForChoiceAtoms, choiceForPixelPlaceholderAtom } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { choiceForPixel } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [pixelChoice, setPixelChoice] = useState<ChoiceForPixelAtom>(choiceForPixelPlaceholderAtom);
  const [choice, setChoice] = useRecoilState(pixelChoice);
  const possibleStateAtom = useRecoilValue(alternativeForChoiceAtoms[choice]);

  useEffect(() => {
    if (pixelChoice === choiceForPixelPlaceholderAtom) {
      let nextAtom = storeAtomsMethods.getNext();
      if (!nextAtom) {
        nextAtom = getNextAtom(choiceForPixel, defChoice) as ChoiceForPixelAtom;
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
        <Pixel {...{ altControlAtom: possibleStateAtom.atom }} />
      )}
    </div>
  );
};
