import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import type { ChoiceState } from './controls/ChoiceState';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
import { PixelsStage } from './pixels-components/PixelsStage';
import { gridSizeState } from './State/State';

// eslint-disable-next-line no-underscore-dangle
const _App: FC = () => {
  const defChoiceState: ChoiceState = {
    choice: 0,
  };
  const choiceStateRecord = useRef(defChoiceState);

  const gridSize = useRecoilValue(gridSizeState);

  useEffect(() => {
    choiceStateRecord.current.choice = 0;
  }, [gridSize]);

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
          <RepaintButton {...{ choiceStateRecord }} />
          <DisableEnableButtons {...{ choiceStateRecord }} />
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
  );
};

export const App: FC = () => (
  <RecoilRoot>
    {/* eslint-disable-next-line react/jsx-pascal-case */}
    <_App />
  </RecoilRoot>
);
