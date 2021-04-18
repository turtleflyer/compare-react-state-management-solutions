import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import type {
  AlternativeForChoice,
  AlternativeForChoiceState,
  ColorForAlternative,
  ColorForAlternativeState,
  PixelChoice,
  State,
} from './StateInterface';
import { alternativeForChoicePlaceholderKey, colorForAlternativeKeyPrefix } from './StateInterface';

export const DEF_COLOR = '#AAAAAA';

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
