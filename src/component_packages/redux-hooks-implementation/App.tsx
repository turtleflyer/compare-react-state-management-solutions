import { ControlPanel } from '@compare-react-state-management-solutions/control-panel';
import type { FC } from 'react';
import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  getPaintRandomPixels,
  getPaintRandomSinglePixel,
  getRepaintRow,
  getSwitchRowGetter,
} from './controlStage';
import { PixelsStage } from './pixels-components/PixelsStage';
import { getGridSize } from './State/selectors';
import { useCreateStore } from './State/store';

const AppToBeWrappedInProvider: FC<{ onGridChosen: (p: { gridSize: number }) => void }> = ({
  onGridChosen,
}) => {
  const dispatch = useDispatch();
  const gridSize = useSelector(getGridSize);

  return (
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
          gridSize,
          repaintRow: getRepaintRow(dispatch),
          getSwitchRow: getSwitchRowGetter(dispatch),
          onGridChosen,
          paintRandomPixels: getPaintRandomPixels(dispatch, gridSize),
          paintRandomSinglePixel: getPaintRandomSinglePixel(dispatch, gridSize),
        }}
      />
    </div>
  );
};

export const App: FC = () => {
  const [store, refreshKey, commandToCreateFreshStore] = useCreateStore();

  return (
    <Provider {...{ store, key: refreshKey }}>
      <AppToBeWrappedInProvider {...{ onGridChosen: commandToCreateFreshStore }} />
    </Provider>
  );
};
