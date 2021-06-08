import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { alternativeForChoiceKeys, setInterstate, useInterstate } from '../State/State';
import type { ChoiceForPixel, PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: number;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixel>(
    choiceForPixelPlaceholderKey
  );

  const choice = useInterstate(choiceForPixel);
  const possibleAltKey = useInterstate(alternativeForChoiceKeys[choice]);

  useEffect(() => {
    const nextKey = getNextKey(choiceForPixelPlaceholderKey);
    storeKeysMethods.push(nextKey);
    setInterstate(nextKey, defChoice);
    setChoiceForPixel(nextKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div {...{ style }}>
      {possibleAltKey && choiceForPixel !== choiceForPixelPlaceholderKey && (
        <Pixel {...{ altControlKey: possibleAltKey }} />
      )}
    </div>
  );
};
