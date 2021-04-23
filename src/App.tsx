import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import {
  useDisableRows,
  useEnableRows,
  useGridSize,
  usePaintRandomPixels,
  usePaintRandomSinglePixel,
  useRepaintRow,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useCreateStore } from './State/store';

export const App: FC = () => {
  const [store, refreshKey, commandToCreateFreshStore] = useCreateStore();

  return (
    <Provider {...{ store, key: refreshKey }}>
      <div
        {...{
          style: {
            display: 'flex',
            flexDirection: 'column',
            margin: '10px auto 10px 10px',
          },
        }}
      >
        <PixelsStage />
        <ControlPanel
          {...{
            headline: 'Implemented using "react-redux" library',
            useRepaintRow,
            useDisableRows,
            useEnableRows,
            usePaintRandomSinglePixel,
            usePaintRandomPixels,
            useGridSize,
            onGridChosen: commandToCreateFreshStore,
          }}
        />
      </div>
    </Provider>
  );
};
