import type { State } from './StateInterface';

export const createSelector =
  <K extends keyof State>(k: K): ((state: State) => State[K]) =>
  (state: State) =>
    state[k];
