import type { CSSProperties, FC } from 'react';
import React from 'react';
import { App as RecoilApp } from 'recoil-component';
import { App as ReduxConnectApp } from 'redux-connect-component';
import { App as ReduxHooksApp } from 'redux-hooks-component';
import { App as UseInterstateApp } from 'use-interstate-component';

const appsContainerStyle: CSSProperties = { display: 'flex' };

export const App: FC = () => (
  <div {...{ style: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 20px)' } }}>
    <div {...{ style: { display: 'flex', flexGrow: 1 } }}>
      <div {...{ style: appsContainerStyle }}>
        <RecoilApp />
      </div>
      <div {...{ style: appsContainerStyle }}>
        <UseInterstateApp />
      </div>
      <div {...{ style: appsContainerStyle }}>
        <ReduxConnectApp />
      </div>
      <div {...{ style: appsContainerStyle }}>
        <ReduxHooksApp />
      </div>
    </div>
  </div>
);
