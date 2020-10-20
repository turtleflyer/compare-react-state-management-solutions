import type { FC } from 'react';
import React from 'react';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { MassivePaintButton } from './controls/MassivePaintButton';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
import { useMeasurePerformance } from './perf-measure/useMeasurePerformance';
import { PixelsStage } from './pixels-components/PixelsStage';

export const App: FC = () => {
  return (
    <div
      {...{
        style: {
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 20px)',
          margin: 10,
        },
      }}
    >
      <PixelsStage />
      <div
        {...{
          style: {
            display: 'flex',
            marginTop: 10,
          },
        }}
      >
        <div
          {...{
            style: {
              flexGrow: 0,
              marginRight: 20,
              width: 400,
            },
          }}
        >
          <RepaintButton />
          <DisableEnableButtons />
          <RandomPaintButton />
          <MassivePaintButton />
        </div>
        <div
          {...{
            style: {
              flexGrow: 1,
              position: 'relative',
            },
          }}
        >
          <ChooseGrid />
        </div>
      </div>
    </div>
  );
};
