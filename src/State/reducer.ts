import { getRandomColor } from 'random-color';
import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  defInitialState,
} from './State';
import type {
  AlternativeForChoice,
  ColorForAlternative,
  PixelChoice,
  State,
} from './StateInterface';

let initialState: Readonly<Partial<State>>;

export function appReducer(state = initialState as State, action: ActionReturn): State {
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
        const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(
          alternativeOfChoice
        );

        return {
          ...state,
          ...colorForAlternativeForChoiceEntry,
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
        const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(
          alternativeOfChoice
        );

        return {
          ...state,
          ...colorForAlternativeForChoiceEntry,
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

function createSetOfEntries(): Readonly<Pick<State, ColorForAlternative | AlternativeForChoice>> {
  return ([0, 1] as const).reduce(
    (entries, c) => ({ ...entries, ...createColorForAlternativeForChoiceEntry(c) }),
    {} as Pick<State, ColorForAlternative | AlternativeForChoice>
  );
}

export function initializeState(gridSize: number): void {
  initialState = { ...defInitialState, gridSize, ...createSetOfEntries() };
}
