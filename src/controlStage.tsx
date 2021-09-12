import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  setInterstate,
  useInterstate,
} from './State/State';
import type {
  ColorForAlternativeState,
  PixelChoice,
  RememberActiveChoiceState,
} from './State/StateInterface';
import { rememberActiveChoiceKey } from './State/StateInterface';
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

export const useDisableRows = (): (() => void) | null =>
  useInterstate.acceptSelector(({ [alternativeForChoiceKeys[1]]: possibleColor }) =>
    possibleColor === null
      ? null
      : () => {
          setInterstate(() => ({
            [alternativeForChoiceKeys[1]]: null,
            [rememberActiveChoiceKey]: 0 as PixelChoice,
          }));
        }
  );

export const useEnableRows = (): (() => void) | null =>
  useInterstate.acceptSelector(({ [alternativeForChoiceKeys[1]]: possibleColor }) =>
    possibleColor === null
      ? () => {
          setInterstate(() => createColorForAlternativeForChoiceEntry(1));
        }
      : null
  );

export const paintRandomSinglePixelDependedOnGridSize = ({
  gridSize,
}: {
  gridSize: number;
}): void => {
  setInterstate(drawPixelToPaint(gridSize ** 2), (prev) => (1 - prev) as PixelChoice);
};

export const paintRandomPixelsDependedOnGridSize = ({
  gridSize,
  percentage,
}: {
  gridSize: number;
  percentage: number;
}): void => {
  const allPixelsNumber = gridSize ** 2;
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
