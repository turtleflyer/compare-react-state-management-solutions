import {
  BlockingSpinner,
  PerfInfoProvider,
} from '@compare-react-state-management-solutions/performance-info';
import { App as RecoilApp } from '@compare-react-state-management-solutions/recoil-component';
import { App as ReduxHooksApp } from '@compare-react-state-management-solutions/redux-hooks-component';
import { App as UseInterstateApp } from '@compare-react-state-management-solutions/use-interstate-component';
import type { CSSProperties, FC } from 'react';
import { useState } from 'react';
import packageConfig from '../package.json';
import { InfoPanel, TAB_HEADER_HEIGHT } from './internal_packages/info-panel/InfoPanel';

const { version } = packageConfig;

const DEF_GRID_SIZE = 32;

const outerContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const mainContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: TAB_HEADER_HEIGHT,
};

const versionInfoStyle: CSSProperties = { margin: '5px 0 0 10px', fontWeight: 'bold' };

const readmeStyle: CSSProperties = {
  display: 'inline-block',
  fontWeight: 'normal',
  marginLeft: '0.5em',
};

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
          <div {...{ style: versionInfoStyle }}>
            {`v.${version} •`}
            <a
              {...{
                href: 'https://github.com/turtleflyer/compare-react-state-management-solutions#readme',
                style: readmeStyle,
              }}
            >
              Learn about this project
            </a>
          </div>

          <div {...{ style: appContainerStyle }}>
            <ReduxHooksApp {...{ defGridSize: DEF_GRID_SIZE }} />
            <RecoilApp {...{ defGridSize: DEF_GRID_SIZE }} />
            <UseInterstateApp {...{ defGridSize: DEF_GRID_SIZE }} />
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
