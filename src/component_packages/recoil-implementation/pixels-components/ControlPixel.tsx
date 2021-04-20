import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import { choiceForPixelPlaceholderAtom, getAlternativeForChoiceAtoms } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };
  const [choiceForPixel, setChoiceForPixel] = useState(choiceForPixelPlaceholderAtom);
  const choice = useRecoilValue(choiceForPixel);
  const alternativeForChoiceAtoms = getAlternativeForChoiceAtoms();
  const possibleStateAtom = useRecoilValue(alternativeForChoiceAtoms[choice]);

  useEffect(() => {
    const nextAtom = getNextAtom(choiceForPixelPlaceholderKey, defChoice);
    storeAtomsMethods.push(nextAtom);
    setChoiceForPixel(nextAtom);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div {...{ style }}>
      {possibleStateAtom && choiceForPixel !== choiceForPixelPlaceholderAtom && (
        <Pixel {...{ altControlAtom: possibleStateAtom.atom }} />
      )}
    </div>
  );
};
