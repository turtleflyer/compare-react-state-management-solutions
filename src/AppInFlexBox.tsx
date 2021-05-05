import { PerfInfoProvider } from '@compare-react-state-management-solutions/performance-info';
import { App as RecoilApp } from '@compare-react-state-management-solutions/recoil-component';
import { App as ReduxHooksApp } from '@compare-react-state-management-solutions/redux-hooks-component';
import { App as UseInterstateApp } from '@compare-react-state-management-solutions/use-interstate-component';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { InfoPanel } from './internal_packages/info-panel/InfoPanel';

const mainContainerStyle: CSSProperties = {
  display: 'flex',
  height: 'calc(100vh - 0px)',
  flexDirection: 'column',
};

const versionInfoStyle: CSSProperties = { margin: '5px 0 0 10px', fontWeight: 'bold' };

const appContainerStyle: CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',
  marginRight: 30,
};

export const AppInFlexBox: FC = () => (
  <div {...{ style: mainContainerStyle }}>
    <div {...{ style: versionInfoStyle }}>v.2.0.0</div>
    <PerfInfoProvider>
      <div {...{ style: appContainerStyle }}>
        <ReduxHooksApp />
        <RecoilApp />
        <UseInterstateApp />
      </div>
      <InfoPanel />
    </PerfInfoProvider>
  </div>
);
