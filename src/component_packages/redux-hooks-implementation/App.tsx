import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import { useProvideModuleNameAndRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
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

export const MODULE_NAME = 'react-redux';

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  margin: '10px auto 1px 10px',
};

export const App: FC = () => {
  const [store, refreshKey, commandToCreateFreshStore] = useCreateStore();
  const { provideModuleNameAndRef } = useProvideModuleNameAndRef();

  const provideRef = (e: HTMLElement): void => {
    provideModuleNameAndRef([MODULE_NAME, e]);
  };

  return (
    <Provider {...{ store, key: refreshKey }}>
      <div {...{ style: containerStyle }}>
        <PixelsStage {...{ provideRef }} />
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
            moduleName: MODULE_NAME,
          }}
        />
      </div>
    </Provider>
  );
};
