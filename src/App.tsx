import type { FC } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import { ChooseGrid } from './controls/ChooseGrid';
import { DisableEnableButtons } from './controls/DisableEnableButtons';
import { MassivePaintButton } from './controls/MassivePaintButton';
import { RandomPaintButton } from './controls/RandomPaintButton';
import { RepaintButton } from './controls/RepaintButton';
import { PixelsStage } from './pixels-components/PixelsStage';
import { useCreateStore } from './State/store';

export const App: FC = () => {
  const [store, refreshKey, commandToCreateFreshStore] = useCreateStore();

  return (
    <Provider {...{ store, key: refreshKey }}>
      <div {...{ style: { display: 'inline-block' } }}>
        <div
          {...{
            style: {
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100vh - 20px)',
              margin: '10px auto 10px 10px',
            },
          }}
        >
          <PixelsStage />
          <div {...{ style: { margin: '10px 0 auto 5px' } }}>
            <div {...{ style: { margin: '0 0 10px' } }}>
              <strong>
                Implemented using &apos;react-redux&apos; (hooks) library
              </strong>
            </div>
            <RepaintButton />
            <DisableEnableButtons />
            <RandomPaintButton />
            <MassivePaintButton />
            <div {...{ style: { borderTop: '0.5px solid gray', margin: '15px 0' } }} />
            <ChooseGrid {...{ beAwareWhenChosen: commandToCreateFreshStore }} />
          </div>
        </div>
      </div>
    </Provider>
  );
};
