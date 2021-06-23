import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import {
  useDisableRows,
  useEnableRows,
  usePaintRandomPixelsDependedOnGridSize,
  usePaintRandomSinglePixelDependedOnGridSize,
  useRepaintRow,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshStage } from './State/store';

export const MODULE_NAME = 'react-redux';

export const App: FC<{ defGridSize: number }> = ({ defGridSize }) => {
  const { store, commandToRefreshStage, gridSize } = useRefreshStage({ defGridSize });

  return (
    <Provider {...{ store }}>
      <ControlPanel
        {...{
          headline: 'Implemented using "react-redux" library',
          useRepaintRow,
          useDisableRows,
          useEnableRows,
          usePaintRandomSinglePixel: () =>
            usePaintRandomSinglePixelDependedOnGridSize({ gridSize }),
          usePaintRandomPixels: () => usePaintRandomPixelsDependedOnGridSize({ gridSize }),
          gridSize,
          onGridChosen: commandToRefreshStage,
          moduleName: MODULE_NAME,
        }}
      >
        <PixelsStage {...{ gridSize }} />
      </ControlPanel>
    </Provider>
  );
};
