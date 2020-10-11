import type { FC } from 'react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
import { PixelsStage } from './pixels-components/PixelsStage';

export const App: FC = () => (
  <RecoilRoot>
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
        </div>
        <div
          {...{
            style: {
              flexGrow: 1,
              position: 'relative',
            },
          }}
        >
          <div
            {...{
              style: {
                position: 'absolute',
                width: 300,
                top: '50%',
                transform: 'translateY(-49%)',
              },
            }}
          >
            <ChooseGrid />
          </div>
        </div>
      </div>
    </div>
  </RecoilRoot>
);
