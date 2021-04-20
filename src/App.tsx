import { TipsPoolProvider } from '@compare-react-state-management-solutions/performance-info';
import { App as RecoilApp } from '@compare-react-state-management-solutions/recoil-component';
import { App as ReduxHooksApp } from '@compare-react-state-management-solutions/redux-hooks-component';
import { App as UseInterstateApp } from '@compare-react-state-management-solutions/use-interstate-component';
import type { CSSProperties, FC } from 'react';
import React from 'react';

const appsContainerStyle: CSSProperties = { display: 'flex' };

export const App: FC = () => (
  <TipsPoolProvider>
    <div {...{ style: { display: 'flex', flexDirection: 'column', height: 'calc(100vh - 20px)' } }}>
      <div {...{ style: { margin: '5px 0 0 10px', fontWeight: 'bold' } }}>v.1.5.0</div>
      <div {...{ style: { display: 'flex', flexGrow: 1 } }}>
        <div {...{ style: appsContainerStyle }}>
          <RecoilApp />
        </div>
        <div {...{ style: appsContainerStyle }}>
          <UseInterstateApp />
        </div>
        <div {...{ style: appsContainerStyle }}>
          <ReduxHooksApp />
        </div>
      </div>
    </div>
  </TipsPoolProvider>
);
