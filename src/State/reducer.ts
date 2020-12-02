import { getRandomColor } from 'random-color';
import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import { alternativeForChoiceKeys, getNextColorForAlternativeAtom, initialState } from './State';
import { PixelChoice, State } from './StateInterface';

export function appReducer(state = initialState as State, action: ActionReturn): State {
  switch (action.type) {
    case ActionType.SET_CHOICE_FOR_PIXEL:
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
      const prevChoice = state[pixel];

      return { ...state, [pixel]: (1 - prevChoice) as PixelChoice };
    }

    case ActionType.CHOOSE_GRID: {
      const {
        payload: { gridSize },
      } = action;

      return { ...state, gridSize };
    }

    case ActionType.REMEMBER_ACTIVE_CHOICE: {
      const {
        payload: { rememberActiveChoice },
      } = action;

      return { ...state, rememberActiveChoice };
    }

    case ActionType.TURN_ON_ALTERNATIVE: {
      const {
        payload: { alternativeOfChoice },
      } = action;
      const prevValue = state[alternativeForChoiceKeys[alternativeOfChoice]];

      if (!prevValue) {
        const [nextColorForAlternativeKey, nextColor] = getNextColorForAlternativeAtom(
          alternativeOfChoice
        );

        return {
          ...state,
          [alternativeForChoiceKeys[alternativeOfChoice]]: nextColorForAlternativeKey,
          [nextColorForAlternativeKey]: nextColor,
        };
      }

      return state;
    }
    case ActionType.SWITCH_ALTERNATIVES: {
      const {
        payload: { alternativeOfChoice },
      } = action;
      const prevValue = state[alternativeForChoiceKeys[alternativeOfChoice]];

      if (!prevValue) {
        const [nextColorForAlternativeKey, nextColor] = getNextColorForAlternativeAtom(
          alternativeOfChoice
        );

        return {
          ...state,
          [alternativeForChoiceKeys[alternativeOfChoice]]: nextColorForAlternativeKey,
          [nextColorForAlternativeKey]: nextColor,
          rememberActiveChoice: alternativeOfChoice,
        };
      }

      const { rememberActiveChoice: prevActiveChoice } = state;

      return {
        ...state,
        [alternativeForChoiceKeys[alternativeOfChoice]]: null,
        rememberActiveChoice: (1 - prevActiveChoice) as PixelChoice,
      };
    }

    case ActionType.REPAINT_ROW: {
      const { rememberActiveChoice: activeChoice } = state;
      const alternative = state[alternativeForChoiceKeys[activeChoice]];
      const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

      return {
        ...state,
        rememberActiveChoice: state[alternativeForChoiceKeys[nextPotentialChoice]]
          ? nextPotentialChoice
          : activeChoice,
        ...(alternative ? { [alternative]: getRandomColor(state[alternative]) } : {}),
      };
    }

    default:
      return state;
  }
}
