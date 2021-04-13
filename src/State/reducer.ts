import { getRandomColor } from '@~internal/random-color';
import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  initialState,
} from './State';
import type {
  AlternativeForChoiceState,
  ChoiceForPixel,
  ColorForAlternativeState,
  PixelChoice,
  State,
} from './StateInterface';

let initState: State;

// eslint-disable-next-line @typescript-eslint/default-param-last
export const appReducer = (state = initState, action: ActionReturn): State => {
  switch (action.type) {
    case ActionType.CREATE_NEW_PIXEL_ENTRY: {
      const {
        payload: { choice, pixel },
      } = action;

      return { ...state, [pixel]: choice };
    }

    case ActionType.SWITCH_PIXEL_CHOICE: {
      const {
        payload: { pixel },
      } = action;

      return { ...state, ...updatePixel({} as State, pixel) };
    }

    case ActionType.SWITCH_MULTIPLE_PIXELS: {
      const {
        payload: { pixels },
      } = action;

      const stateUpdate = pixels.reduce(updatePixel, {} as State);

      return { ...state, ...stateUpdate };
    }

    case ActionType.SWITCH_ALTERNATIVES: {
      const {
        payload: { choice },
      } = action;

      const altForChoiceKey = alternativeForChoiceKeys[choice];
      const colorForAltKey = state[altForChoiceKey];

      if (colorForAltKey) {
        return {
          ...state,
          [altForChoiceKey]: null,
          rememberActiveChoice: (1 - choice) as PixelChoice,
        };
      }

      const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(choice);

      return {
        ...state,
        ...colorForAlternativeForChoiceEntry,
        rememberActiveChoice: choice,
      };
    }

    case ActionType.REPAINT_ROW: {
      const { rememberActiveChoice: activeChoice } = state;
      const { [alternativeForChoiceKeys[activeChoice]]: altKey } = state;
      const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

      return {
        ...state,
        ...(state[alternativeForChoiceKeys[nextPotentialChoice]] === null
          ? {}
          : { rememberActiveChoice: nextPotentialChoice }),
        ...(altKey === null ? {} : { [altKey]: getRandomColor(state[altKey]) }),
      };
    }

    default:
      return state;
  }

  function updatePixel(update: State, pixel: ChoiceForPixel) {
    const prevChoice = state[pixel];

    return { ...update, [pixel]: (1 - prevChoice) as PixelChoice };
  }
};

export const initializeState = (gridSize: number): void => {
  initState = {
    ...initialState,

    ...([0, 1] as const).reduce(
      (entries, c) => ({ ...entries, ...createColorForAlternativeForChoiceEntry(c) }),
      {} as ColorForAlternativeState & AlternativeForChoiceState
    ),

    gridSize,
  };
};
