export const choiceForPixelPlaceholderKey = 'choice-for-pixel' as const;
export type ChoiceForPixel = typeof choiceForPixelPlaceholderKey;
export type PixelChoice = 0 | 1;
type ChoiceForPixelState = { [P in ChoiceForPixel]: PixelChoice };

export const colorForAlternativePlaceholderKey = 'color-for-alternative';
export type ColorForAlternative = typeof colorForAlternativePlaceholderKey;
export type ColorValue = string;
type ColorForAlternativeState = { [P in ColorForAlternative]: ColorValue };

export const alternativeForChoiceKey = 'alternative-for-choice';
export type AlternativeForChoice = typeof alternativeForChoiceKey;
type AlternativeForChoiceState = {
  [P in AlternativeForChoice]: ColorForAlternativeAtom | null;
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

export type Atom<K extends keyof State> = readonly [K, State[K]];

export type ChoiceForPixelAtom = Atom<ChoiceForPixel>;
export type ColorForAlternativeAtom = Atom<ColorForAlternative>;
export type AlternativeForChoiceAtom = Atom<AlternativeForChoice>;
