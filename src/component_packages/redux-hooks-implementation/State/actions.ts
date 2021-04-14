import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import type { ChoiceForPixel, PixelChoice } from './StateInterface';

export const createNewPixelEntryAction = (
  pixel: ChoiceForPixel,
  choice: PixelChoice
): ActionReturn<ActionType.CREATE_NEW_PIXEL_ENTRY> => ({
  type: ActionType.CREATE_NEW_PIXEL_ENTRY,
  payload: { pixel, choice },
});

export const switchPixelChoiceAction = (
  pixel: ChoiceForPixel
): ActionReturn<ActionType.SWITCH_PIXEL_CHOICE> => ({
  type: ActionType.SWITCH_PIXEL_CHOICE,
  payload: { pixel },
});

export const switchMultiplePixelsAction = (
  pixels: ChoiceForPixel[]
): ActionReturn<ActionType.SWITCH_MULTIPLE_PIXELS> => ({
  type: ActionType.SWITCH_MULTIPLE_PIXELS,
  payload: { pixels },
});

export const switchAlternativeAction = (
  alternativeOfChoice: PixelChoice
): ActionReturn<ActionType.SWITCH_ALTERNATIVES> => ({
  type: ActionType.SWITCH_ALTERNATIVES,
  payload: { choice: alternativeOfChoice },
});

export const repaintRowAction = (): ActionReturn<ActionType.REPAINT_ROW> => ({
  type: ActionType.REPAINT_ROW,
});
