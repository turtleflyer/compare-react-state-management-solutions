import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import { alternativeForChoiceAtoms, choiceForPixelPlaceholderAtom } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { choiceForPixel as choiceForPixelPref } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixelAtom>(
    choiceForPixelPlaceholderAtom
  );
  const [choice, setChoice] = useRecoilState(choiceForPixel);
  const possibleStateAtom = useRecoilValue(alternativeForChoiceAtoms[choice]);

  useEffect(() => {
    if (choiceForPixel === choiceForPixelPlaceholderAtom) {
      let nextAtom = storeAtomsMethods.getNext();
      if (!nextAtom) {
        nextAtom = getNextAtom(choiceForPixelPref, defChoice) as ChoiceForPixelAtom;
        storeAtomsMethods.push(nextAtom);
      }
      setChoiceForPixel(nextAtom);
    } else {
      setChoice(defChoice);
    }
  }, [defChoice, choiceForPixel, setChoice]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && choiceForPixel !== choiceForPixelPlaceholderAtom && (
        <Pixel {...{ altControlAtom: possibleStateAtom.atom }} />
      )}
    </div>
  );
};
