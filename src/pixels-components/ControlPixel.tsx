import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { getNextAtom } from '../helpers/getNextAtom';
import { alternativeForChoiceKeys, getAtom, useInterstate } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixelAtom>(
    getAtom(choiceForPixelPlaceholderKey)
  );
  const [choice, setChoice] = useInterstate(...choiceForPixel).both();
  const possibleStateAtom = useInterstate(...getAtom(alternativeForChoiceKeys[choice])).get();

  useEffect(() => {
    if (choiceForPixel[0] === choiceForPixelPlaceholderKey) {
      const nextAtom = getNextAtom(choiceForPixelPlaceholderKey, defChoice);
      storeAtomsMethods.push(nextAtom);
      setChoiceForPixel(nextAtom);
    }
  }, [defChoice, choiceForPixel, setChoice]);

  return (
    <div {...{ style }}>
      {possibleStateAtom && choiceForPixel[0] !== choiceForPixelPlaceholderKey && (
        <Pixel {...{ altControlAtom: possibleStateAtom }} />
      )}
    </div>
  );
};
