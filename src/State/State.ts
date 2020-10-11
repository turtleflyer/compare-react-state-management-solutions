import { atom, RecoilState } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoiceAtom,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  ColorValue,
  PixelChoice,
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

export const choiceForPixelPlaceholderAtom = atom({
  key: choiceForPixel,
  default: 0,
}) as ChoiceForPixelAtom;

export const colorForAlternativePlaceholderAtom = atom({
  key: colorForAlternative,
  default: DEF_COLOR,
}) as ColorForAlternativeAtom;

export function getNextColorForAlternativeAtom(choice: PixelChoice): RecoilState<ColorValue> {
  return getNextAtom(
    `${colorForAlternative}-${choice}` as ColorForAlternative,
    DEF_COLOR as ColorValue
  );
}
export const alternativeForChoiceAtoms = ([0, 1] as const).map(
  (c) =>
    atom({
      key: `${alternativeForChoice}-${c}`,
      default: { atom: getNextColorForAlternativeAtom(c) },
    }) as AlternativeForChoiceAtom
) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

export const gridSizeAtom = atom({ key: gridSize, default: DEF_GRID_SIZE });

export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoice, default: 0 });
