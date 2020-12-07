import { getNextKey } from 'get-next-key';
import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createNewPixelEntryAction } from '../State/actions';
import { getAlternativeForChoice, getChoiceForPixel } from '../State/selectors';
import { alternativeForChoiceKeys } from '../State/State';
import type {
  ChoiceForPixel,
  ColorForAlternative,
  PixelChoice,
  State,
} from '../State/StateInterface';
import { choiceForPixelPlaceholderKey } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { Pixel } from './Pixel';

const ControlPixelInner = connect(
  (state: State, { choiceForPixel }: { choiceForPixel: ChoiceForPixel }) => ({
    possibleAltControl: getAlternativeForChoice(
      state,
      alternativeForChoiceKeys[getChoiceForPixel(state, choiceForPixel)]
    ),
  })
)(function ControlPixelInner({ possibleAltControl }) {
  return possibleAltControl ? <Pixel {...{ altControl: possibleAltControl }} /> : null;
} as FC<{
  possibleAltControl: ColorForAlternative | null;
}>);

export const ControlPixel = connect(null, {
  createPixel: createNewPixelEntryAction,
})(function ControlPixel({ pixelSize, defChoice, createPixel }) {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixel>(
    choiceForPixelPlaceholderKey
  );

  useEffect(() => {
    const nextKey = getNextKey(choiceForPixelPlaceholderKey);
    createPixel(nextKey, defChoice);
    storeKeysMethods.push(nextKey);
    setChoiceForPixel(nextKey);
  }, [createPixel, defChoice]);

  return (
    <div {...{ style }}>
      {choiceForPixel === choiceForPixelPlaceholderKey ? null : (
        <ControlPixelInner {...{ choiceForPixel }} />
      )}
    </div>
  );
} as FC<{
  pixelSize: string;
  defChoice: PixelChoice;
  createPixel: (pixel: ChoiceForPixel, choice: PixelChoice) => void;
}>);
