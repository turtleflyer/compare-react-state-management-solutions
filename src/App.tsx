import type { FC } from 'react';
import React from 'react';
import { App as RecoilApp } from 'recoil-component';
import { App as UseInterstateApp } from 'use-interstate-component';
import { App as ReduxConnectApp } from 'redux-connect-component';

export const App: FC = () => {
  return (
    <div {...{ style: { display: 'flex' } }}>
      <div>
        <RecoilApp />
      </div>
      <div>
        <UseInterstateApp />
      </div>
      <div>
        <ReduxConnectApp />
      </div>
    </div>
  );
};
