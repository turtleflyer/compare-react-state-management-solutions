import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  useDisableRows,
  useEnableRows,
  usePaintRandomPixelsDependedOnGridSize,
  usePaintRandomSinglePixelDependedOnGridSize,
  useRepaintRow,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshStage } from './State/State';

export const MODULE_NAME = 'recoil';

const AppInsideRecoilRoot: FC<{
  defGridSize: number;
}> = ({ defGridSize }) => {
  const { commandToRefreshStage, gridSize } = useRefreshStage({ defGridSize });

  return (
    <ControlPanel
      {...{
        headline: 'Implemented using "recoil" library',
        useRepaintRow,
        useDisableRows,
        useEnableRows,
        usePaintRandomSinglePixel: () => usePaintRandomSinglePixelDependedOnGridSize({ gridSize }),
        usePaintRandomPixels: () => usePaintRandomPixelsDependedOnGridSize({ gridSize }),
        gridSize,
        onGridChosen: commandToRefreshStage,
        moduleName: MODULE_NAME,
      }}
    >
      <PixelsStage {...{ gridSize }} />
    </ControlPanel>
  );
};

export const App: FC<{
  defGridSize: number;
}> = (props) => {
  return (
    <RecoilRoot>
      <AppInsideRecoilRoot {...props} />
    </RecoilRoot>
  );
};
