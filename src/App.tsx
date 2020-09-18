import type { CSSProperties, FC } from 'react';
import React, { Profiler, useRef } from 'react';
import { RecoilRoot } from 'recoil';
import { DisableEnableButtons } from './DisableEnableButtons';
import { PixelsStage } from './PixelsStage';
import { RandomPaintButton } from './RandomPaintButton';
import { ChoiceState, RepaintButton } from './RepaintButton';

const mainWrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
};
const buttonsContainersStyle: CSSProperties = {
  marginTop: '10px',
};

// eslint-disable-next-line no-underscore-dangle
const _App: FC = () => {
  const defChoiceState: ChoiceState = {
    choice: 0,
  };
  const choiceStateRecord = useRef(defChoiceState);

  return (
    <div {...{ style: mainWrapperStyle }}>
      <PixelsStage />
      <div {...{ style: buttonsContainersStyle }}>
        <RepaintButton {...{ choiceStateRecord }} />
        <DisableEnableButtons {...{ choiceStateRecord }} />
        <RandomPaintButton />
      </div>
    </div>
  );
};

export const App: FC = () => (
  <Profiler
    {...{
      id: 'App',
      onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
        // eslint-disable-next-line no-console
        console.log(
          'id, phase, actualDuration, baseDuration, startTime, commitTime: ',
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime
        );
      },
    }}
  >
    <RecoilRoot>
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <_App />
    </RecoilRoot>
  </Profiler>
);
