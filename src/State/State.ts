import { getRandomColor } from 'random-color';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  ColorForAlternative,
  PixelChoice,
  State,
} from './StateInterface';
import {
  alternativeForChoicePlaceholderKey,
  colorForAlternativePlaceholderKey,
} from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export const alternativeForChoiceKeys = ([0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as readonly AlternativeForChoice[]) as readonly [AlternativeForChoice, AlternativeForChoice];

function createColorForAlternativeAtom(choice: PixelChoice) {
  return getNextAtom(
    `${colorForAlternativePlaceholderKey}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );
}

export function createColorForAlternativeForChoiceEntry(
  choice: PixelChoice
): Readonly<Pick<State, ColorForAlternative | AlternativeForChoice>> {
  const [colorForAlternativeKey, color] = createColorForAlternativeAtom(choice);

  return {
    [alternativeForChoiceKeys[choice]]: colorForAlternativeKey,
    [colorForAlternativeKey]: color,
  };
}

export const defInitialState: Readonly<Partial<State>> = { rememberActiveChoice: 0 };
