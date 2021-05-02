import type { MetricsComponentProps } from '@compare-react-state-management-solutions/use-perf-observer';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import type { Tags } from './CollectDataProvider';
import { DisplayInfo } from './DisplayInfo';
import { InfoMark } from './InfoMark';
import { usePerfInfoMethods } from './PerfInfoProvider';

const AcknowledgeTip: FC = () => (
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
);

export const PerformanceInfo: FC<MetricsComponentProps & { tags?: Tags }> = (props) => {
  const { addData } = usePerfInfoMethods();

  useEffect(() => {
    if (props.status === 'done') {
      const { data, tags = ['none'] } = props;
      addData({ data, tags });
    }
  });

  switch (props.status) {
    case 'done': {
      const {
        data: { TTI, TBT },
      } = props;

      return (
        <DisplayInfo
          {...{
            info: [
              `TTI: ${Math.round(TTI)}ms - TBT: ${Math.round(TBT)}ms`,
              <InfoMark key="InfoTip" {...{ popupInfo: <AcknowledgeTip /> }} />,
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
      return <DisplayInfo />;
  }
};

export type { PerfInfoData } from './CollectDataProvider';

export {
  PerfInfoProvider,
  useClearDataPool,
  useGetDataPool,
  useProvideModuleNameAndRef,
  useGetRef,
} from './PerfInfoProvider';
