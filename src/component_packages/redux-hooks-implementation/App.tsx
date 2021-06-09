import type { CSSProperties, FC, ReactElement } from 'react';
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
  margin: '10px 10px 0',
};

interface ControlPanelProps {
  headline: string;
  useRepaintRow: () => () => void;
  useDisableRows: () => (() => void) | null;
  useEnableRows: () => (() => void) | null;
  usePaintRandomSinglePixel: () => () => void;
  usePaintRandomPixels: () => (percentage: number) => void;
  useGridSize: () => number;
  onGridChosen: (v: { gridSize: number }) => void;
  moduleName: string;
  children: ReactElement;
}

export const App: FC<{
  defGridSize: number;
  ControlPanel: (props: ControlPanelProps) => ReactElement | null;
}> = ({ defGridSize, ControlPanel }) => {
  const [store, refreshKey, commandToCreateFreshStore] = useCreateStore({ defGridSize });

  return (
    <Provider {...{ store, key: refreshKey }}>
      <div {...{ style: containerStyle }}>
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
        >
          <PixelsStage />
        </ControlPanel>
      </div>
    </Provider>
  );
};
