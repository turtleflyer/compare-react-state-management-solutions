import type { MetricConsumerProps } from '@compare-react-state-management-solutions/use-perf-metric';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useSetToBlock } from './BlockingParametersProvider';
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

export const PerformanceInfo: FC<(MetricConsumerProps | { status?: undefined }) & { tags?: Tags }> =
  (props) => {
    const { addData } = usePerfInfoMethods();
    const setToBlock = useSetToBlock();

    useEffect(() => {
      switch (props.status) {
        case 'done':
          {
            const { data, tags = ['none'] } = props;
            addData({ data, tags });
          }

          setToBlock(false);

          break;

        case 'pending':
          setToBlock(true);

          break;

        case 'error':
          setToBlock(false);

          break;

        default:
          setToBlock(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.status]);

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

export { useAddRef, useToBlock } from './BlockingParametersProvider';
export { BlockingSpinner } from './BlockingSpinner';
export type { PerfInfoData } from './CollectDataProvider';
export {
  PerfInfoProvider,
  useClearDataPool,
  useGetDataPool,
  useGetRef,
  useProvideModuleNameAndRef,
} from './PerfInfoProvider';
