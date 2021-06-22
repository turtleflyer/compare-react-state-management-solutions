import type { AppAction, ChoiceForPixel, PixelChoice } from './StateInterface';
import { ActionType } from './StateInterface';

export const createNewPixelEntryAction = (
  pixel: ChoiceForPixel,
  choice: PixelChoice
): AppAction<ActionType.CREATE_NEW_PIXEL_ENTRY> => ({
  type: ActionType.CREATE_NEW_PIXEL_ENTRY,
  payload: { pixel, choice },
});

export const switchPixelChoiceAction = (
  pixel: ChoiceForPixel
): AppAction<ActionType.SWITCH_PIXEL_CHOICE> => ({
  type: ActionType.SWITCH_PIXEL_CHOICE,
  payload: { pixel },
});

export const switchMultiplePixelsAction = (
  pixels: ChoiceForPixel[]
): AppAction<ActionType.SWITCH_MULTIPLE_PIXELS> => ({
  type: ActionType.SWITCH_MULTIPLE_PIXELS,
  payload: { pixels },
});

export const disableRowAction = (): AppAction<ActionType.DISABLE_ROW> => ({
  type: ActionType.DISABLE_ROW,
});

export const enableRowAction = (): AppAction<ActionType.ENABLE_ROW> => ({
  type: ActionType.ENABLE_ROW,
});

export const repaintRowAction = (): AppAction<ActionType.REPAINT_ROW> => ({
  type: ActionType.REPAINT_ROW,
});
