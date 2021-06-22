import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import {
  paintRandomPixelsDependedOnGridSize,
  paintRandomSinglePixelDependedOnGridSize,
  repaintRow,
  useDisableRows,
  useEnableRows,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshStage } from './State/State';

export const MODULE_NAME = 'use-interstate';

export const App: FC<{
  defGridSize: number;
}> = ({ defGridSize }) => {
  const { commandToRefreshStage, gridSize } = useRefreshStage({ defGridSize });

  return (
    <ControlPanel
      {...{
        headline: 'Implemented using "use-interstate" library',
        repaintRow,
        useDisableRows,
        useEnableRows,
        paintRandomSinglePixel: () => paintRandomSinglePixelDependedOnGridSize({ gridSize }),

        paintRandomPixels: (percentage) =>
          paintRandomPixelsDependedOnGridSize({ gridSize, percentage }),

        gridSize,
        onGridChosen: commandToRefreshStage,
        moduleName: MODULE_NAME,
      }}
    >
      <PixelsStage {...{ gridSize }} />
    </ControlPanel>
  );
};
