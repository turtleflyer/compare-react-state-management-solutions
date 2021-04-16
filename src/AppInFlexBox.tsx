import { TipsPoolProvider } from '@compare-react-state-management-solutions/performance-info';
import type { FC } from 'react';
import React from 'react';
import { App } from './App';

export const AppInFlexBox: FC = () => (
  <div {...{ style: { display: 'flex', height: '100vh' } }}>
    <TipsPoolProvider>
      <App />
    </TipsPoolProvider>
  </div>
);
