import { useState } from 'react';
import { createStore, Store } from 'redux';
import type { ActionReturn, ActionType } from './actionTypes';
import { appReducer, initializeState } from './reducer';
import { DEF_GRID_SIZE } from './State';
import type { State } from './StateInterface';

export function useCreateStore(): [
  Store<State, ActionReturn<ActionType>>,
  (gridSize: number) => void
] {
  const [store, provideStore] = useState<Store<State, ActionReturn<ActionType>>>(() => {
    initializeState(DEF_GRID_SIZE);

    return createStore(appReducer);
  });

  function commandToCreateFreshStore(gridSize: number): void {
    initializeState(gridSize);

    return provideStore(createStore(appReducer));
  }

  return [store, commandToCreateFreshStore];
}
