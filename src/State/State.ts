import { getUseInterstate } from '@smart-hooks/use-interstate';
import { getRandomColor } from 'random-color';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  AlternativeForChoiceAtom,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  PixelChoice,
  State,
} from './StateInterface';
import {
  alternativeForChoice,
  choiceForPixel,
  colorForAlternative,
  gridSize,
  rememberActiveChoice,
} from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export const choiceForPixelPlaceholderAtom = [choiceForPixel, 0] as ChoiceForPixelAtom;

export const colorForAlternativePlaceholderAtom = [
  colorForAlternative,
  DEF_COLOR,
] as ColorForAlternativeAtom;

export function getNextColorForAlternativeAtom(choice: PixelChoice): ColorForAlternativeAtom {
  return getNextAtom(
    `${colorForAlternative}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );
}
export const alternativeForChoiceAtoms = (([0, 1] as const).map((c) => [
  `${alternativeForChoice}-${c}` as AlternativeForChoice,
  getNextColorForAlternativeAtom(c),
]) as readonly AlternativeForChoiceAtom[]) as readonly [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
];

export const gridSizeAtom = [gridSize, DEF_GRID_SIZE] as const;

export const rememberActiveChoiceAtom = [rememberActiveChoice, 0] as const;

export const { useInterstate } = getUseInterstate<State>();
