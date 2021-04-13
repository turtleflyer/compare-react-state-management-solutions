import { getNextKey } from '@~internal/get-next-key';
import { getRandomColor } from '@~internal/random-color';
import type {
  AlternativeForChoice,
  AlternativeForChoiceState,
  ColorForAlternative,
  ColorForAlternativeState,
  PixelChoice,
  State,
} from './StateInterface';
import { alternativeForChoicePlaceholderKey, colorForAlternativeKeyPrefix } from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export const alternativeForChoiceKeys = [0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const createColorForAlternativeForChoiceEntry = (
  choice: PixelChoice
): ColorForAlternativeState & AlternativeForChoiceState => {
  const colorForAlternativeKey = getNextKey(
    `${colorForAlternativeKeyPrefix}-${choice}` as ColorForAlternative
  );
  const color = getRandomColor(DEF_COLOR);

  return {
    [alternativeForChoiceKeys[choice]]: colorForAlternativeKey,
    [colorForAlternativeKey]: color,
  };
};

export const initialState = { rememberActiveChoice: 0 } as State;
