import type { FC } from 'react';
import React from 'react';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { MassivePaintButton } from './controls/MassivePaintButton';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useRefreshApp } from './State/State';

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
      <div {...{ style: { margin: '10px 0 auto 5px' } }}>
        <div {...{ style: { margin: '0 0 10px' } }}>
          <strong>Implemented using &apos;use-interstate&apos; library</strong>
        </div>
        <RepaintButton />
        <DisableEnableButtons />
        <RandomPaintButton />
        <MassivePaintButton />
        <div {...{ style: { borderTop: '0.5px solid gray', margin: '15px 0' } }} />
        <ChooseGrid {...{ beAwareWhenChosen: commandToCreateRefreshKey }} />
      </div>
    </div>
  );
};
