import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  readInterstate,
  setInterstate,
  useInterstate,
} from './State/State';
import type {
  ColorForAlternativeState,
  PixelChoice,
  RememberActiveChoiceState,
} from './State/StateInterface';
import { gridSizeKey, rememberActiveChoiceKey } from './State/StateInterface';
import { storeKeysMethods } from './State/storeKeysMethods';

const ONE_HUNDRED_PERCENT = 100;

export const repaintRow = (): void => {
  setInterstate((state) => {
    const { [rememberActiveChoiceKey]: activeChoice } = state;
    const { [alternativeForChoiceKeys[activeChoice]]: altKey } = state;
    const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

    return {
      ...(state[alternativeForChoiceKeys[nextPotentialChoice]] === null
        ? ({} as RememberActiveChoiceState)
        : { [rememberActiveChoiceKey]: nextPotentialChoice }),
      ...(altKey === null
        ? ({} as ColorForAlternativeState)
        : { [altKey]: getRandomColor(state[altKey]) }),
    };
  });
};

export const useDisableRows = (): (() => void) | undefined =>
  useInterstate.acceptSelector(({ [alternativeForChoiceKeys[1]]: possibleColor }) =>
    possibleColor === null
      ? undefined
      : () => {
          setInterstate(() => ({
            [alternativeForChoiceKeys[1]]: null,
            [rememberActiveChoiceKey]: 0,
          }));
        }
  );

export const useEnableRows = (): (() => void) | undefined =>
  useInterstate.acceptSelector(({ [alternativeForChoiceKeys[1]]: possibleColor }) =>
    possibleColor === null
      ? () => {
          setInterstate(() => createColorForAlternativeForChoiceEntry(1));
        }
      : undefined
  );

export const paintRandomSinglePixel = (): void => {
  setInterstate(
    drawPixelToPaint(readInterstate(gridSizeKey) ** 2),
    (prev) => (1 - prev) as PixelChoice
  );
};

export const paintRandomPixels = (percentage: number): void => {
  const allPixelsNumber = readInterstate(gridSizeKey) ** 2;
  const pixelsNumberToPaint = (allPixelsNumber * percentage) / ONE_HUNDRED_PERCENT;

  drawPixels(allPixelsNumber, pixelsNumberToPaint).map((p) => {
    setInterstate(
      storeKeysMethods.get(p) ??
        (() => {
          throw Error('It must be defined');
        })(),

      (prevChoice) => (1 - prevChoice) as PixelChoice
    );
  });
};
