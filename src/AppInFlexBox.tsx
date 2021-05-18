import {
  BlockingSpinner,
  PerfInfoProvider,
} from '@compare-react-state-management-solutions/performance-info';
import { App as RecoilApp } from '@compare-react-state-management-solutions/recoil-component';
import { App as ReduxHooksApp } from '@compare-react-state-management-solutions/redux-hooks-component';
import { App as UseInterstateApp } from '@compare-react-state-management-solutions/use-interstate-component';
import type { CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { InfoPanel, TAB_HEADER_HEIGHT } from './internal_packages/info-panel/InfoPanel';
import { version } from '../package.json';

const outerContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const mainContainerStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: TAB_HEADER_HEIGHT,
};

const versionInfoStyle: CSSProperties = { margin: '5px 0 0 10px', fontWeight: 'bold' };

const appContainerStyle: CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  marginRight: 30,
};

export const AppInFlexBox: FC = () => {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const calculateViewportHeight = (element: HTMLDivElement | null) => {
    if (viewportHeight === null && element) {
      const { documentElement } = document;
      documentElement.style.overflowX = 'scroll';
      setViewportHeight(documentElement.clientHeight);
      documentElement.style.overflowX = 'auto';
    }
  };

  return viewportHeight === null ? (
    <div {...{ style: { visibility: 'hidden' }, ref: calculateViewportHeight }} />
  ) : (
    <PerfInfoProvider>
      <div {...{ style: outerContainerStyle }}>
        <div
          {...{
            style: { ...mainContainerStyle, height: viewportHeight },
          }}
        >
          <div {...{ style: versionInfoStyle }}>{`v.${version}`}</div>

          <div {...{ style: appContainerStyle }}>
            <ReduxHooksApp />
            <RecoilApp />
            <UseInterstateApp />
          </div>

          <BlockingSpinner {...{ zIndex: 10 }} />
        </div>

        <InfoPanel
          {...{
            options: { notCountFirstMeasure: true },
            zIndex: 20,
          }}
        />
      </div>
    </PerfInfoProvider>
  );
};
