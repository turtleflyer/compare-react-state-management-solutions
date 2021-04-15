import type {
  AlternativeForChoice,
  ChoiceForPixel,
  ColorForAlternative,
  State,
} from './StateInterface';

export const getChoiceForPixel = createSelector<ChoiceForPixel>();
export const getColorForAlternative = createSelector<ColorForAlternative>();
export const getAlternativeForChoice = createSelector<AlternativeForChoice>();
export const getGridSize = (state: State): number => state.gridSize;

function createSelector<K extends keyof State>(): (state: State, a: K) => State[K] {
  return (state, a) => state[a];
}
