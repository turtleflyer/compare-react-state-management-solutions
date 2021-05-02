import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import { useProvideModuleNameAndRef } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
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
  margin: '10px auto 1px 10px',
};

export const App: FC = () => {
  const [refreshKey, commandToCreateRefreshKey] = useRefreshApp();
  const { provideModuleNameAndRef } = useProvideModuleNameAndRef();

  const provideRef = (e: HTMLElement): void => {
    provideModuleNameAndRef([MODULE_NAME, e]);
  };

  return (
    <div {...{ style: containerStyle, key: refreshKey }}>
      <PixelsStage {...{ provideRef }} />
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
      />
    </div>
  );
};
