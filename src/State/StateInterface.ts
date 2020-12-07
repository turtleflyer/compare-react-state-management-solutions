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
type AlternativeForChoiceState = {
  [P in AlternativeForChoice]: ColorForAlternative | null;
};

interface GridSizeState {
  gridSize: number;
}

interface RememberActiveChoiceState {
  rememberActiveChoice: PixelChoice;
}

export type State = ChoiceForPixelState &
  ColorForAlternativeState &
  AlternativeForChoiceState &
  GridSizeState &
  RememberActiveChoiceState;

export type Atom<K extends keyof State> = readonly [K, State[K]];

export type ColorForAlternativeAtom = Atom<ColorForAlternative>;
