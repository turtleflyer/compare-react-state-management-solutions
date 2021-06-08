import type { CSSProperties, FC, ReactElement } from 'react';
import React from 'react';
import {
  paintRandomPixels,
  paintRandomSinglePixel,
  repaintRow,
  useDisableRows,
  useEnableRows,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { readInterstate, useRefreshApp } from './State/State';
import { gridSizeKey } from './State/StateInterface';

export const MODULE_NAME = 'use-interstate';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '10px 10px 0',
};

interface ControlPanelProps {
  headline: string;
  repaintRow: () => void;
  useDisableRows: () => (() => void) | null;
  useEnableRows: () => (() => void) | null;
  paintRandomSinglePixel: () => void;
  paintRandomPixels: (percentage: number) => void;
  gridSize: number;
  onGridChosen: (v: { gridSize: number }) => void;
  moduleName: string;
  children: ReactElement;
}

export const App: FC<{
  defGridSize: number;
  ControlPanel: (props: ControlPanelProps) => ReactElement | null;
}> = ({ defGridSize, ControlPanel }) => {
  const [refreshKey, commandToCreateRefreshKey] = useRefreshApp({ defGridSize });

  return (
    <div {...{ style: containerStyle, key: refreshKey }}>
      <ControlPanel
        {...{
          headline: 'Implemented using "use-interstate" library',
          repaintRow,
          useDisableRows,
          useEnableRows,
          paintRandomSinglePixel,
          paintRandomPixels,
          gridSize: readInterstate(gridSizeKey),
          onGridChosen: commandToCreateRefreshKey,
          moduleName: MODULE_NAME,
        }}
      >
        <PixelsStage />
      </ControlPanel>
    </div>
  );
};
