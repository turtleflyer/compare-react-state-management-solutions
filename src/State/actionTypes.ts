import type { ChoiceForPixel, PixelChoice } from './StateInterface';

export enum ActionType {
  SET_CHOICE_FOR_PIXEL = 'pixels/setChoiceForPixel',
  CREATE_NEW_PIXEL_ENTRY = 'pixels/createNewPixelEntry',
  SWITCH_PIXEL_CHOICE = 'pixels/switchPixelChoice',
  CHOOSE_GRID = 'grid/chooseGrid',
  REMEMBER_ACTIVE_CHOICE = 'management/rememberActiveChoice',
  TURN_ON_ALTERNATIVE = 'alternatives/turnOnAlternative',
  SWITCH_ALTERNATIVES = 'alternatives/switchAlternatives',
  REPAINT_ROW = 'alternatives/repaintRow',
}

interface PixelsPayloads {
  pixel: ChoiceForPixel;
  choice: PixelChoice;
}

interface AlternativesPayloads {
  alternativeOfChoice: PixelChoice;
}

export type ActionReturn<T extends ActionType = ActionType> =
  | (T extends ActionType.SET_CHOICE_FOR_PIXEL
      ? {
          type: ActionType.SET_CHOICE_FOR_PIXEL;
          payload: PixelsPayloads;
        }
      : never)
  | (T extends ActionType.CREATE_NEW_PIXEL_ENTRY
      ? {
          type: ActionType.CREATE_NEW_PIXEL_ENTRY;
          payload: PixelsPayloads;
        }
      : never)
  | (T extends ActionType.SWITCH_PIXEL_CHOICE
      ? {
          type: ActionType.SWITCH_PIXEL_CHOICE;
          payload: { pixel: ChoiceForPixel };
        }
      : never)
  | (T extends ActionType.CHOOSE_GRID
      ? { type: ActionType.CHOOSE_GRID; payload: { gridSize: number } }
      : never)
  | (T extends ActionType.REMEMBER_ACTIVE_CHOICE
      ? { type: ActionType.REMEMBER_ACTIVE_CHOICE; payload: { rememberActiveChoice: PixelChoice } }
      : never)
  | (T extends ActionType.TURN_ON_ALTERNATIVE
      ? { type: ActionType.TURN_ON_ALTERNATIVE; payload: AlternativesPayloads }
      : never)
  | (T extends ActionType.SWITCH_ALTERNATIVES
      ? { type: ActionType.SWITCH_ALTERNATIVES; payload: AlternativesPayloads }
      : never)
  | (T extends ActionType.REPAINT_ROW ? { type: ActionType.REPAINT_ROW } : never);
