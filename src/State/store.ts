import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { useState } from 'react';
import { createStore, Store } from 'redux';
import type { ActionReturn, ActionType } from './actionTypes';
import { createReducer } from './reducer';
import type { State } from './StateInterface';

export const useCreateStore = ({
  defGridSize,
}: {
  defGridSize: number;
}): [Store<State, ActionReturn<ActionType>>, string, (p: { gridSize: number }) => void] => {
  const [store, provideStore] = useState<Store<State, ActionReturn<ActionType>>>(() => {
    return createStore(createReducer(defGridSize));
  });

  const [refreshKey, setNewKey] = useState(createFreshKey);

  const commandToCreateFreshStore = ({ gridSize }: { gridSize: number }): void => {
    provideStore(createStore(createReducer(gridSize)));
    setNewKey(createFreshKey);
  };

  return [store, refreshKey, commandToCreateFreshStore];
};

function createFreshKey(): string {
  return getNextKey('refresh-key');
}
