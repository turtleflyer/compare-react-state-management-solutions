import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import type { Reducer } from 'redux';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  initialState,
} from './State';
import type {
  AlternativeForChoiceState,
  AppAction,
  ChoiceForPixel,
  ColorForAlternativeState,
  PixelChoice,
  State,
} from './StateInterface';
import { ActionType } from './StateInterface';

export const createReducer = (): Reducer<State, AppAction> => {
  const initState = {
    ...initialState,

    ...([0, 1] as const).reduce(
      (entries, c) => ({ ...entries, ...createColorForAlternativeForChoiceEntry(c) }),
      {} as ColorForAlternativeState & AlternativeForChoiceState
    ),
  };

  // eslint-disable-next-line @typescript-eslint/default-param-last
  const reducer = (state = initState, action: AppAction): State => {
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

      case ActionType.DISABLE_ROW: {
        return { ...state, [alternativeForChoiceKeys[1]]: null, rememberActiveChoice: 0 };
      }

      case ActionType.ENABLE_ROW: {
        return {
          ...state,
          ...(state[alternativeForChoiceKeys[1]] === null
            ? createColorForAlternativeForChoiceEntry(1)
            : null),
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

  return reducer;
};
