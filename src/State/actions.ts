import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import type { ChoiceForPixel, PixelChoice } from './StateInterface';

export function createNewPixelEntryAction(
  pixel: ChoiceForPixel,
  choice: PixelChoice
): ActionReturn<ActionType.CREATE_NEW_PIXEL_ENTRY> {
  return { type: ActionType.CREATE_NEW_PIXEL_ENTRY, payload: { pixel, choice } };
}

export function switchPixelChoiceAction(
  pixel: ChoiceForPixel
): ActionReturn<ActionType.SWITCH_PIXEL_CHOICE> {
  return { type: ActionType.SWITCH_PIXEL_CHOICE, payload: { pixel } };
}

export function chooseGridAction(gridSize: number): ActionReturn<ActionType.CHOOSE_GRID> {
  return { type: ActionType.CHOOSE_GRID, payload: { gridSize } };
}

export function rememberActiveChoiceAction(
  rememberActiveChoice: PixelChoice
): ActionReturn<ActionType.REMEMBER_ACTIVE_CHOICE> {
  return { type: ActionType.REMEMBER_ACTIVE_CHOICE, payload: { rememberActiveChoice } };
}

export function turnOnAlternativeAction(
  alternativeOfChoice: PixelChoice
): ActionReturn<ActionType.TURN_ON_ALTERNATIVE> {
  return { type: ActionType.TURN_ON_ALTERNATIVE, payload: { choice: alternativeOfChoice } };
}

export function switchAlternativeAction(
  alternativeOfChoice: PixelChoice
): ActionReturn<ActionType.SWITCH_ALTERNATIVES> {
  return { type: ActionType.SWITCH_ALTERNATIVES, payload: { choice: alternativeOfChoice } };
}

export function repaintRowAction(): ActionReturn<ActionType.REPAINT_ROW> {
  return { type: ActionType.REPAINT_ROW };
}
