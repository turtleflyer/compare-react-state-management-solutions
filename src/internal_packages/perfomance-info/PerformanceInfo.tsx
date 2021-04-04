import type { MetricsComponentProps } from '@~internal/use-perf-observer';
import type { FC } from 'react';
import React from 'react';
import { DisplayInfo } from './DisplayInfo';
import { InfoMark } from './InfoMark';

const AknowlageTip: FC = () => (
  /* eslint-disable react/jsx-one-expression-per-line */
  <>
    <strong>TTI (Time to Interactive)</strong> metric measures the time until the main sub-resources
    of the page have rendered and it is capable of reliably responding to user input quickly
    (similar to <a {...{ href: 'https://web.dev/tti/', target: 'blank' }}>that</a>
    ).
    <br />
    <br />
    <strong>TBT (Total Blocking Time)</strong> measures the total amount of time until TTI in the
    chunks where the main thread was blocked for long enough to prevent input responsiveness
    (similar to <a {...{ href: 'https://web.dev/tbt/', target: 'blank' }}>that</a>).
  </>
  /* eslint-enable */
);

export const PerformanceInfo: FC<MetricsComponentProps> = (props) => {
  switch (props.status) {
    case 'done': {
      const { TTI, TBT } = props.data;
      return (
        <DisplayInfo
          {...{
            info: [
              `TTI: ${Math.round(TTI)}ms - TBT: ${Math.round(TBT)}ms`,
              <InfoMark key="InfoTip" {...{ popupInfo: <AknowlageTip /> }} />,
            ],
          }}
        />
      );
    }

    case 'pending':
      return <DisplayInfo {...{ info: ['performance measuring...'] }} />;

    case 'error':
      return (
        <DisplayInfo
          {...{
            info: ['error', <InfoMark key="InfoTip" {...{ popupInfo: props.error.message }} />],
          }}
        />
      );

    default:
      break;
  }

  return <DisplayInfo />;
};

export { TipsPoolProvider } from './TipsPoolProvider';
