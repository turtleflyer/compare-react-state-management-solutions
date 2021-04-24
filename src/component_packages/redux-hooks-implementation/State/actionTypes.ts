import type { ChoiceForPixel, PixelChoice } from './StateInterface';

export enum ActionType {
  CREATE_NEW_PIXEL_ENTRY = 'pixels/createNewPixelEntry',
  SWITCH_PIXEL_CHOICE = 'pixels/switchPixelChoice',
  SWITCH_MULTIPLE_PIXELS = 'pixels/switchMultiplePixels',
  DISABLE_ROW = 'alternatives/disableRow',
  ENABLE_ROW = 'alternatives/enableRow',
  REPAINT_ROW = 'alternatives/repaintRow',
}

export type ActionReturn<T extends ActionType = ActionType> =
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
