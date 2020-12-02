import { getRandomColor } from 'random-color';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  ColorForAlternative,
  ColorForAlternativeAtom,
  PixelChoice,
  State,
} from './StateInterface';
import { alternativeForChoice, choiceForPixel, colorForAlternative } from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export const choiceForPixelPlaceholderKey = choiceForPixel;

export const colorForAlternativePlaceholderKey = colorForAlternative;

export function getNextColorForAlternativeAtom(choice: PixelChoice): ColorForAlternativeAtom {
  return getNextAtom(
    `${colorForAlternative}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );
}

export const alternativeForChoiceKeys = ([0, 1].map(
  (c) => `${alternativeForChoice}-${c}`
) as readonly AlternativeForChoice[]) as readonly [AlternativeForChoice, AlternativeForChoice];

const colorForAlternativeForChoiceEntries = alternativeForChoiceKeys.reduce(
  (entries, alternativeForChoiceKey, c) => {
    const [colorForAlternativeKey, color] = getNextColorForAlternativeAtom(c as PixelChoice);
    return {
      ...entries,
      [alternativeForChoiceKey]: colorForAlternativeKey,
      [colorForAlternativeKey]: color,
    };
  },
  {} as Readonly<Pick<State, ColorForAlternative | AlternativeForChoice>>
);

export const initialState: Partial<State> = {
  ...{
    [choiceForPixelPlaceholderKey]: 0,
    gridSize: DEF_GRID_SIZE,
    rememberActiveChoice: 0,
  },
  ...colorForAlternativeForChoiceEntries,
};
