import type { RecoilState } from 'recoil';

export type Atom<K extends keyof State> = RecoilState<State[K]>;

export const choiceForPixelPlaceholderKey = 'choice-for-pixel';

export type ChoiceForPixelState = Record<ChoiceForPixel, PixelChoice>;
export type ChoiceForPixel = typeof choiceForPixelPlaceholderKey;
export type PixelChoice = 0 | 1;

export const colorForAlternativeKeyPrefix = 'color-for-alternative';
export type ColorForAlternativeState = Record<ColorForAlternative, ColorValue>;
export type ColorForAlternative = typeof colorForAlternativeKeyPrefix;
export type ColorValue = string;

export const alternativeForChoiceKeyPrefixBase = 'alternative-for-choice';

export type AlternativeForChoiceState = Record<
  AlternativeForChoice,
  HoldColorForAlternativeAtom | null
>;
export type AlternativeForChoice = typeof alternativeForChoiceKeyPrefixBase;
export type HoldColorForAlternativeAtom = {
  atom: Atom<ColorForAlternative>;
};

export const gridSizeKey = 'grid-size';

export type GridSizeState = Record<GridSize, number>;
export type GridSize = typeof gridSizeKey;

export const rememberActiveChoiceKey = 'remember-active-choice';

export interface RememberActiveChoiceState {
  [rememberActiveChoiceKey]: PixelChoice;
}

export type State = ChoiceForPixelState &
  ColorForAlternativeState &
  AlternativeForChoiceState &
  GridSizeState &
  RememberActiveChoiceState;

export type ChoiceForPixelAtom = Atom<ChoiceForPixel>;
export type ColorForAlternativeAtom = Atom<ColorForAlternative>;
export type AlternativeForChoiceAtom = Atom<AlternativeForChoice>;
