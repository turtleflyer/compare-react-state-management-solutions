export const choiceForPixel = 'choice-for-pixel' as const;
export type ChoiceForPixel = typeof choiceForPixel;
export type PixelChoice = 0 | 1;
type ChoiceForPixelState = { [P in ChoiceForPixel]: PixelChoice };

export const colorForAlternative = 'color-for-alternative';
export type ColorForAlternative = typeof colorForAlternative;
export type ColorValue = string;
type ColorForAlternativeState = { [P in ColorForAlternative]: ColorValue };

export const alternativeForChoice = 'alternative-for-choice';
export type AlternativeForChoice = typeof alternativeForChoice;
type AlternativeForChoiceState = {
  [P in AlternativeForChoice]: ColorForAlternativeAtom | null;
};

export const gridSize = 'grid-size';
interface GridSizeState {
  [gridSize]: number;
}

export const rememberActiveChoice = 'remember-active-choice';
interface RememberActiveChoiceState {
  [rememberActiveChoice]: PixelChoice;
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
