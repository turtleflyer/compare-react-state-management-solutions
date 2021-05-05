import { PerfInfoProvider } from '@compare-react-state-management-solutions/performance-info';
import type { CSSProperties, FC } from 'react';
import React from 'react';
import { App } from './App';
import { InfoPanel } from './internal_packages/info-panel/InfoPanel';

const mainContainerStyle: CSSProperties = {
  display: 'flex',
  height: '100vh',
  flexDirection: 'column',
};

const appContainerStyle: CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',
  marginRight: 30,
};

export const AppInFlexBox: FC = () => (
  <div {...{ style: mainContainerStyle }}>
    <PerfInfoProvider>
      <div {...{ style: appContainerStyle }}>
        <App />
      </div>
      <InfoPanel />
    </PerfInfoProvider>
  </div>
);
