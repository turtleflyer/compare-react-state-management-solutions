import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  switchRowsHooks,
  useGridSize,
  usePaintRandomPixels,
  usePaintRandomSinglePixel,
  useRepaintRow,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshApp } from './State/State';

export const App: FC = () => {
  const [refreshKey, commandToCreateRefreshKey] = useRefreshApp();

  return (
    <RecoilRoot>
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
            headline: 'Implemented using "recoil" library',
            useRepaintRow,
            switchRowsHooks,
            usePaintRandomSinglePixel,
            usePaintRandomPixels,
            useGridSize,
            onGridChosen: commandToCreateRefreshKey,
          }}
        />
      </div>
    </RecoilRoot>
  );
};
