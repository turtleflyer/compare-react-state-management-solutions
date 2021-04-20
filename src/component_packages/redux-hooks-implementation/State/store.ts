import { DEF_GRID_SIZE } from '@compare-react-state-management-solutions/control-panel';
import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { useState } from 'react';
import { createStore, Store } from 'redux';
import type { ActionReturn, ActionType } from './actionTypes';
import { appReducer, initializeState } from './reducer';
import type { State } from './StateInterface';

export const useCreateStore = (): [
  Store<State, ActionReturn<ActionType>>,
  string,
  (p: { gridSize: number }) => void
] => {
  const [store, provideStore] = useState<Store<State, ActionReturn<ActionType>>>(() => {
    initializeState(DEF_GRID_SIZE);

    return createStore(appReducer);
  });

  const [refreshKey, setNewKey] = useState(createFreshKey);

  const commandToCreateFreshStore = ({ gridSize }: { gridSize: number }): void => {
    initializeState(gridSize);
    provideStore(createStore(appReducer));
    setNewKey(createFreshKey);
  };

  return [store, refreshKey, commandToCreateFreshStore];
};

function createFreshKey(): string {
  return getNextKey('refresh-key');
}
