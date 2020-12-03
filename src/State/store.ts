import { useState } from 'react';
import { createStore, Store } from 'redux';
import { ActionReturn, ActionType } from './actionTypes';
import { appReducer, resetInitState } from './reducer';
import { State } from './StateInterface';

export function useCreateStore(): [
  Store<State, ActionReturn<ActionType>>,
  (gridSize: number) => void
] {
  const [store, provideStore] = useState<Store<State, ActionReturn<ActionType>>>(() =>
    createStore(appReducer)
  );

  function commandToCreateFreshStore(gridSize: number): void {
    resetInitState(gridSize);

    return provideStore(createStore(appReducer));
  }

  return [store, commandToCreateFreshStore];
}
