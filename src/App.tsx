import type { FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { ChooseGrid } from './ChooseGrid/ChooseGrid';
import { DisableEnableButtons } from './DisableEnableButtons';
import { PixelsStage } from './PixelsStage';
import { RandomPaintButton } from './RandomPaintButton';
import { ChoiceState, RepaintButton } from './RepaintButton';
import { gridSizeState } from './State';

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
            width: 700,
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
