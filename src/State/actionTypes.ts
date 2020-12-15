import type { ChoiceForPixel, PixelChoice } from './StateInterface';

export enum ActionType {
  CREATE_NEW_PIXEL_ENTRY = 'pixels/createNewPixelEntry',
  SWITCH_PIXEL_CHOICE = 'pixels/switchPixelChoice',
  SWITCH_MULTIPLE_PIXELS = 'pixels/switchMultiplePixels',
  CHOOSE_GRID = 'grid/chooseGrid',
  REMEMBER_ACTIVE_CHOICE = 'management/rememberActiveChoice',
  TURN_ON_ALTERNATIVE = 'alternatives/turnOnAlternative',
  SWITCH_ALTERNATIVES = 'alternatives/switchAlternatives',
  REPAINT_ROW = 'alternatives/repaintRow',
}

interface AlternativesPayloads {
  choice: PixelChoice;
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
  | (T extends ActionType.CHOOSE_GRID ? { type: T; payload: { gridSize: number } } : never)
  | (T extends ActionType.REMEMBER_ACTIVE_CHOICE
      ? { type: T; payload: { rememberActiveChoice: PixelChoice } }
      : never)
  | (T extends ActionType.TURN_ON_ALTERNATIVE ? { type: T; payload: AlternativesPayloads } : never)
  | (T extends ActionType.SWITCH_ALTERNATIVES ? { type: T; payload: AlternativesPayloads } : never)
  | (T extends ActionType.REPAINT_ROW ? { type: T } : never);
