import type { Store } from 'redux';

export const choiceForPixelPlaceholderKey = 'choice-for-pixel';

export type ChoiceForPixelState = Record<ChoiceForPixel, PixelChoice>;
export type ChoiceForPixel = typeof choiceForPixelPlaceholderKey;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export type PixelChoice = 0 | 1;

export const colorForAlternativeKeyPrefix = 'color-for-alternative';

export type ColorForAlternativeState = Record<ColorForAlternative, ColorValue>;
export type ColorForAlternative = typeof colorForAlternativeKeyPrefix;
export type ColorValue = string;

export const alternativeForChoicePlaceholderKey = 'alternative-for-choice';

export type AlternativeForChoiceState = Record<AlternativeForChoice, ColorForAlternative | null>;
export type AlternativeForChoice = typeof alternativeForChoicePlaceholderKey;

export interface RememberActiveChoiceState {
  rememberActiveChoice: PixelChoice;
}

export type State = ChoiceForPixelState &
  ColorForAlternativeState &
  AlternativeForChoiceState &
  RememberActiveChoiceState;

export type AppStore = Store<State, AppAction>;

export enum ActionType {
  CREATE_NEW_PIXEL_ENTRY = 'pixels/createNewPixelEntry',
  SWITCH_PIXEL_CHOICE = 'pixels/switchPixelChoice',
  SWITCH_MULTIPLE_PIXELS = 'pixels/switchMultiplePixels',
  DISABLE_ROW = 'alternatives/disableRow',
  ENABLE_ROW = 'alternatives/enableRow',
  REPAINT_ROW = 'alternatives/repaintRow',
}

export type AppAction<T extends ActionType = ActionType> =
  | (T extends ActionType.CREATE_NEW_PIXEL_ENTRY
      ? {
          type: T;
          payload: {
            pixel: ChoiceForPixel;
            choice: PixelChoice;
          };
        }
      : never)
  | (T extends ActionType.SWITCH_PIXEL_CHOICE
      ? { type: T; payload: { pixel: ChoiceForPixel } }
      : never)
  | (T extends ActionType.SWITCH_MULTIPLE_PIXELS
      ? { type: T; payload: { pixels: ChoiceForPixel[] } }
      : never)
  | (T extends ActionType.DISABLE_ROW ? { type: T } : never)
  | (T extends ActionType.ENABLE_ROW ? { type: T } : never)
  | (T extends ActionType.REPAINT_ROW ? { type: T } : never);
