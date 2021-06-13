import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  useDisableRows,
  useEnableRows,
  usePaintRandomPixels,
  usePaintRandomSinglePixel,
  useRepaintRow,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshApp } from './State/State';

export const MODULE_NAME = 'recoil';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '10px 10px 0',
};

interface ControlPanelProps {
  headline: string;
  useRepaintRow: () => () => void;
  useDisableRows: () => (() => void) | null;
  useEnableRows: () => (() => void) | null;
  usePaintRandomSinglePixel: () => () => void;
  usePaintRandomPixels: () => [(percentage: number) => void, ReactElement[]];
  gridSize: number;
  onGridChosen: (v: { gridSize: number }) => void;
  moduleName: string;
  children: ReactElement;
}

const AppInsideRecoilRoot: FC<{
  defGridSize: number;
  ControlPanel: (props: ControlPanelProps) => ReactElement | null;
}> = ({ defGridSize, ControlPanel }) => {
  const { refreshKey, commandToCreateRefreshKey, gridSize } = useRefreshApp({ defGridSize });

  return gridSize === 0 ? null : (
    <div {...{ style: containerStyle, key: refreshKey }}>
      <ControlPanel
        {...{
          headline: 'Implemented using "recoil" library',
          useRepaintRow,
          useDisableRows,
          useEnableRows,
          usePaintRandomSinglePixel,
          usePaintRandomPixels,
          gridSize,
          onGridChosen: commandToCreateRefreshKey,
          moduleName: MODULE_NAME,
        }}
      >
        <PixelsStage />
      </ControlPanel>
    </div>
  );
};
export const App: FC<{
  defGridSize: number;
  ControlPanel: (props: ControlPanelProps) => ReactElement | null;
}> = (props) => {
  return (
    <RecoilRoot>
      <AppInsideRecoilRoot {...props} />
    </RecoilRoot>
  );
};
