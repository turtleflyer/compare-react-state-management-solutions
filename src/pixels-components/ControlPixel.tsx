import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPixelEntryAction } from '../State/actions';
import { createSelector } from '../State/selectors';
import { alternativeForChoiceKeys } from '../State/State';
import type { ChoiceForPixel, PixelChoice } from '../State/StateInterface';
import { choiceForPixelPlaceholderKey } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { Pixel } from './Pixel';

export const ControlPixel: FC<{
  pixelSize: string;
  defChoice: PixelChoice;
}> = ({ pixelSize, defChoice }) => {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixel>(
    choiceForPixelPlaceholderKey
  );

  const choice = useSelector(createSelector(choiceForPixel));
  const possibleAltControl = useSelector(createSelector(alternativeForChoiceKeys[choice]));
  const dispatch = useDispatch();

  useEffect(() => {
    const nextKey = getNextKey(choiceForPixelPlaceholderKey);
    storeKeysMethods.push(nextKey);
    dispatch(createNewPixelEntryAction(nextKey, defChoice));
    setChoiceForPixel(nextKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div {...{ style }}>
      {possibleAltControl && choiceForPixel[0] !== choiceForPixelPlaceholderKey && (
        <Pixel {...{ altControl: possibleAltControl }} />
      )}
    </div>
  );
};
