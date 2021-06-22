export const choiceForPixelPlaceholderKey = 'choice-for-pixel';

export type ChoiceForPixelState = Record<ChoiceForPixel, PixelChoice>;
export type ChoiceForPixel = typeof choiceForPixelPlaceholderKey;
export type PixelChoice = 0 | 1;

export const colorForAlternativeKeyPrefix = 'color-for-alternative';

export type ColorForAlternativeState = Record<ColorForAlternative, ColorValue>;
export type ColorForAlternative = typeof colorForAlternativeKeyPrefix;
export type ColorValue = string;

export const alternativeForChoicePlaceholderKey = 'alternative-for-choice';

export type AlternativeForChoiceState = Record<AlternativeForChoice, ColorForAlternative | null>;
export type AlternativeForChoice = typeof alternativeForChoicePlaceholderKey;

export const rememberActiveChoiceKey = 'remember-active-choice';

export interface RememberActiveChoiceState {
  [rememberActiveChoiceKey]: PixelChoice;
}

export type State = ChoiceForPixelState &
  ColorForAlternativeState &
  AlternativeForChoiceState &
  RememberActiveChoiceState;
