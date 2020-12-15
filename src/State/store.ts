import { useMultiState } from '@smart-hooks/use-multi-state';
import { getNextKey } from '@~internal/get-next-key';
import { createStore, Store } from 'redux';
import type { ActionReturn, ActionType } from './actionTypes';
import { appReducer, initializeState } from './reducer';
import { DEF_GRID_SIZE } from './State';
import type { State } from './StateInterface';

function createFreshKey(): string {
  return getNextKey('refresh-key');
}

export function useCreateStore(): [
  Store<State, ActionReturn<ActionType>>,
  string,
  ({ gridSize }: { gridSize: number }) => void
] {
  const [{ store, refreshKey }, { store: provideStore, refreshKey: setNewKey }] = useMultiState<{
    store: Store<State, ActionReturn<ActionType>>;
    refreshKey: string;
  }>({
    store: () => {
      initializeState(DEF_GRID_SIZE);

      return createStore(appReducer);
    },
    refreshKey: createFreshKey,
  });

  function commandToCreateFreshStore({ gridSize }: { gridSize: number }): void {
    initializeState(gridSize);
    provideStore(createStore(appReducer));
    setNewKey(createFreshKey);
  }

  return [store, refreshKey, commandToCreateFreshStore];
}
