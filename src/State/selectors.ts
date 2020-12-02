import type {
  AlternativeForChoice,
  ChoiceForPixel,
  ColorForAlternative,
  State,
} from './StateInterface';

function createSelector<K extends keyof State>(): (state: State, a: K) => State[K] {
  return (state, a) => state[a];
}

export const getChoiceForPixel = createSelector<ChoiceForPixel>();
export const getColorForAlternative = createSelector<ColorForAlternative>();
export const getAlternativeForChoice = createSelector<AlternativeForChoice>();
export function getGridSize(state: State): number {
  return state.gridSize;
}
