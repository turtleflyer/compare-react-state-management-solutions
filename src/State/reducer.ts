import { getRandomColor } from '@~internal/random-color';
import type { ActionReturn } from './actionTypes';
import { ActionType } from './actionTypes';
import {
  alternativeForChoiceKeys,
  createColorForAlternativeForChoiceEntry,
  defInitialState,
} from './State';
import type {
  AlternativeForChoice,
  ChoiceForPixel,
  ColorForAlternative,
  PixelChoice,
  State,
} from './StateInterface';

let initialState: Readonly<Partial<State>>;

export function appReducer(state = initialState as State, action: ActionReturn): State {
  function updatePixel(update: Partial<State>, pixel: ChoiceForPixel) {
    const prevChoice = state[pixel];

    return { ...update, [pixel]: (1 - prevChoice) as PixelChoice };
  }

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

      return { ...state, ...updatePixel({}, pixel) };
    }

    case ActionType.SWITCH_MULTIPLE_PIXELS: {
      const {
        payload: { pixels },
      } = action;

      const stateUpdate = pixels.reduce(updatePixel, {} as Partial<State>);

      return { ...state, ...stateUpdate };
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
        payload: { choice },
      } = action;
      const prevValue = state[alternativeForChoiceKeys[choice]];

      if (!prevValue) {
        const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(choice);

        return {
          ...state,
          ...colorForAlternativeForChoiceEntry,
        };
      }

      return state;
    }

    case ActionType.SWITCH_ALTERNATIVES: {
      const {
        payload: { choice },
      } = action;
      const prevValue = state[alternativeForChoiceKeys[choice]];

      if (!prevValue) {
        const colorForAlternativeForChoiceEntry = createColorForAlternativeForChoiceEntry(choice);

        return {
          ...state,
          ...colorForAlternativeForChoiceEntry,
          rememberActiveChoice: choice,
        };
      }

      return {
        ...state,
        [alternativeForChoiceKeys[choice]]: null,
        rememberActiveChoice: (1 - choice) as PixelChoice,
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
