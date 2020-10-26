import type { FC } from 'react';
import React from 'react';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { MassivePaintButton } from './controls/MassivePaintButton';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
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
            margin: '10px auto 0 0',
            alignItems: 'center',
          },
        }}
      >
        <div
          {...{
            style: {
              marginRight: 20,
            },
          }}
        >
          <RepaintButton />
          <DisableEnableButtons />
          <RandomPaintButton />
          <MassivePaintButton />
        </div>
        <ChooseGrid />
      </div>
    </div>
  );
};
