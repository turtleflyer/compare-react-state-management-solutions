import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import { useProvideModuleNameAndRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import {
  useDisableRows,
  useEnableRows,
  useGridSize,
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

export const App: FC = () => {
  const [refreshKey, commandToCreateRefreshKey] = useRefreshApp();
  const { provideModuleNameAndRef } = useProvideModuleNameAndRef();

  const provideRef = (e: HTMLElement): void => {
    provideModuleNameAndRef([MODULE_NAME, e]);
  };

  return (
    <RecoilRoot {...{ key: refreshKey }}>
      <div {...{ style: containerStyle }}>
        <PixelsStage {...{ provideRef }} />
        <ControlPanel
          {...{
            headline: 'Implemented using "recoil" library',
            useRepaintRow,
            useDisableRows,
            useEnableRows,
            usePaintRandomSinglePixel,
            usePaintRandomPixels,
            useGridSize,
            onGridChosen: commandToCreateRefreshKey,
            moduleName: MODULE_NAME,
          }}
        />
      </div>
    </RecoilRoot>
  );
};
