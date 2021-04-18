import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { paintRandomPixels, paintRandomSinglePixel, repaintRow, switchRows } from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { readInterstate, useRefreshApp } from './State/State';
import { gridSizeKey } from './State/StateInterface';

export const App: FC = () => {
  const [refreshKey, commandToCreateRefreshKey] = useRefreshApp();

  return (
    <div
      {...{
        style: {
          display: 'flex',
          flexDirection: 'column',
          margin: '10px auto 10px 10px',
        },
        key: refreshKey,
      }}
    >
      <PixelsStage />
      <ControlPanel
        {...{
          repaintRow,
          switchRows,
          paintRandomSinglePixel,
          paintRandomPixels,
          gridSize: readInterstate(gridSizeKey),
          onGridChosen: commandToCreateRefreshKey,
        }}
      />
    </div>
  );
};
