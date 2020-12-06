import type { RecoilState } from 'recoil';

export type Atom<K extends keyof State> = RecoilState<State[K]>;

export const choiceForPixelPlaceholderKey = 'choice-for-pixel' as const;
export type ChoiceForPixel = typeof choiceForPixelPlaceholderKey;
export type PixelChoice = 0 | 1;
type ChoiceForPixelState = { [P in ChoiceForPixel]: PixelChoice };

export const colorForAlternativePlaceholderKey = 'color-for-alternative';
export type ColorForAlternative = typeof colorForAlternativePlaceholderKey;
export type ColorValue = string;
type ColorForAlternativeState = { [P in ColorForAlternative]: ColorValue };

export const alternativeForChoicePlaceholderKey = 'alternative-for-choice';
export type AlternativeForChoice = typeof alternativeForChoicePlaceholderKey;
export interface CarryAtom<K extends keyof State> {
  atom: Atom<K>;
}

export type CarryAtomColorForAlternative = CarryAtom<ColorForAlternative> | null;

type AlternativeForChoiceState = {
  [P in AlternativeForChoice]: CarryAtomColorForAlternative;
};

export const gridSizeKey = 'grid-size';
export type GridSize = typeof gridSizeKey;
interface GridSizeState {
  [gridSizeKey]: number;
}

export const rememberActiveChoiceKey = 'remember-active-choice';
interface RememberActiveChoiceState {
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
