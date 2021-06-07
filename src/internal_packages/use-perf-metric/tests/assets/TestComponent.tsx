import type { FC } from 'react';
import React, { StrictMode, useEffect, useState } from 'react';
import type {
  EffectPayload,
  MeasurementStatus,
  MeasurePerformance,
  MetricConsumerProps,
  PerfMetric,
  PerfMetricSettings
} from '../../usePerfMetric';
import { usePerfMetric } from '../../usePerfMetric';

export interface Retrieve {
  measurePerformance?: MeasurePerformance;

  data?: PerfMetric | null;

  status?: MeasurementStatus;

  lunchedAtEffectStage?: boolean;
}

type DisplayComponent = FC<MetricConsumerProps | { [P in keyof MetricConsumerProps]?: undefined }>;

type UseBody = (param: {
  retrieve: Retrieve;
  settings: PerfMetricSettings;
  freshRemount: boolean;
}) => { ReleaseUsePerMetric: FC };

const createNestedComponents = (): {
  useBody: UseBody;
} => {
  let effectStage: boolean;
  let relayingSettings: PerfMetricSettings;
  let retrieve: Retrieve;
  let freshRemount: boolean;
  let isUnmount: boolean;

  const Display: DisplayComponent = ({ data, status }) => {
    Object.assign(retrieve, { data, status });

    useEffect(() => {
      effectStage = true;
    });

    return null;
  };

  const ReleaseUsePerMetric: FC = () => {
    const { measurePerformance: originalMeasurePerformance, WrapMetricConsumer } =
      usePerfMetric(relayingSettings);

    const measurePerformance: MeasurePerformance = (settings: PerfMetricSettings = {}) => {
      retrieve.lunchedAtEffectStage = effectStage = false;
      originalMeasurePerformance(alterPayloadToCatchEffectStage(settings));
    };

    Object.assign(retrieve, { measurePerformance });

    return (
      <WrapMetricConsumer>
        <Display />
      </WrapMetricConsumer>
    );
  };

  const useBody: UseBody = ({ retrieve: _retrieve, settings, freshRemount: _freshRemount }) => {
    retrieve = _retrieve;
    freshRemount = _freshRemount;
    retrieve.lunchedAtEffectStage = effectStage = false;
    relayingSettings = alterPayloadToCatchEffectStage(settings);

    const [_isUnmount, setUnmount] = useState(false);
    isUnmount = _isUnmount;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
      if (isUnmount) {
        setUnmount(false);

        return;
      }

      // eslint-disable-next-line consistent-return
      return () => {
        freshRemount && setUnmount(true);
      };
    });

    return { ReleaseUsePerMetric: isUnmount ? () => null : ReleaseUsePerMetric };
  };

  return { useBody };

  function alterPayloadToCatchEffectStage<P extends PerfMetricSettings>(settings: P): P {
    return {
      ...settings,
      ...(settings.measureAtEffectStage
        ? {
            payload: () => {
              retrieve.lunchedAtEffectStage = effectStage;
              settings.payload?.();
            },
          }
        : {}),
    };
  }
};

export const TestComponent: FC<{
  measureFromCreated?: boolean;
  effectSettings?:
    | { measureAtEffectStage: true; payload: EffectPayload }
    | { measureAtEffectStage?: false };
  id?: string;
  retrieve: Retrieve;
  freshRemount?: boolean;
}> = ({
  measureFromCreated = false,
  effectSettings = { measureAtEffectStage: false },
  id,
  retrieve,
  freshRemount = true,
}) => {
  const settings: PerfMetricSettings = { id, measureFromCreated, ...effectSettings };
  const [{ useBody }] = useState(createNestedComponents);
  const { ReleaseUsePerMetric } = useBody({ retrieve, settings, freshRemount });

  return (
    <StrictMode>
      <ReleaseUsePerMetric />
    </StrictMode>
  );
};
