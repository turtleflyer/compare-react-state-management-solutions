import { getNextKey } from 'get-next-key';
import type { CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createNewPixelEntryAction, setChoiceForPixelAction } from '../State/actions';
import { getAlternativeForChoice, getChoiceForPixel } from '../State/selectors';
import { alternativeForChoiceKeys, choiceForPixelPlaceholderKey } from '../State/State';
import type {
  ChoiceForPixel,
  ColorForAlternative,
  PixelChoice,
  State,
} from '../State/StateInterface';
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
  setChoice: setChoiceForPixelAction,
  createPixel: createNewPixelEntryAction,
})(function ControlPixel({ pixelSize, defChoice, setChoice, createPixel }) {
  const style: CSSProperties = { height: pixelSize, width: pixelSize };

  const [choiceForPixel, setChoiceForPixel] = useState<ChoiceForPixel>(
    choiceForPixelPlaceholderKey
  );

  useEffect(() => {
    if (choiceForPixel === choiceForPixelPlaceholderKey) {
      const nextKey = getNextKey(choiceForPixelPlaceholderKey);
      createPixel(nextKey, defChoice);
      storeKeysMethods.push(nextKey);
      setChoiceForPixel(nextKey);
    }
  }, [choiceForPixel, createPixel, defChoice, setChoice]);

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
  setChoice: (pixel: ChoiceForPixel, choice: PixelChoice) => void;
  createPixel: (pixel: ChoiceForPixel, choice: PixelChoice) => void;
}>);
