import { useState } from 'react';
import { createStore } from 'redux';
import { createReducer } from './reducer';
import type { AppStore } from './StateInterface';
interface UseRefreshStageReturn {
  store: AppStore;
  gridSize: number;
  commandToRefreshStage: CommandToRefreshStage;
}

type CommandToRefreshStage = (arg: { gridSize: number }) => void;

export const useRefreshStage = ({
  defGridSize,
}: {
  defGridSize: number;
}): UseRefreshStageReturn => {
  const [store, provideStore] = useState<AppStore>(() => createStore(createReducer()));
  const [gridSize, setGridSize] = useState(defGridSize);

  const commandToRefreshStage: CommandToRefreshStage = ({ gridSize: nextGridSize }): void => {
    setGridSize(nextGridSize);
    provideStore(createStore(createReducer()));
  };

  return { store, gridSize, commandToRefreshStage };
};
