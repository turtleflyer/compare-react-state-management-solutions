import { App as RecoilApp } from '@~internal/recoil-component';
import { App as ReduxConnectApp } from '@~internal/redux-connect-component';
import { App as ReduxHooksApp } from '@~internal/redux-hooks-component';
import { App as UseInterstateApp } from '@~internal/use-interstate-component';
import type { CSSProperties, FC } from 'react';
import React from 'react';

const appsContainerStyle: CSSProperties = { display: 'flex' };

export const App: FC = () => (
  <div {...{ style: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 20px)' } }}>
    <div {...{ style: { margin: '5px 0 0 10px', fontWeight: 'bold' } }}>v.1.1.0</div>
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
