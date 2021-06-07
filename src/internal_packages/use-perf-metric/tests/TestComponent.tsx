import type { FC } from 'react';
import React, { StrictMode, useEffect, useState } from 'react';
import type {
  EffectPayload,
  MeasurementStatus,
  MeasurePerformance,
  MetricConsumerProps,
  PerfMetric,
  PerfMetricSettings,
} from '../usePerfMetric';
import { usePerfMetric } from '../usePerfMetric';

export interface Retrieve {
  measurePerformance?: MeasurePerformance;

  data?: PerfMetric | null;

  status?: MeasurementStatus;

  lunchedAtEffectStage?: boolean;
}

type DisplayComponent = FC<MetricConsumerProps | { [P in keyof MetricConsumerProps]?: undefined }>;
type UseBody = (param: { retrieve: Retrieve; settings: PerfMetricSettings }) => void;

const createNestedComponents = (): {
  ReleaseUsePerMetric: FC;
  useBody: UseBody;
} => {
  let effectStage: boolean;
  let relayingSettings: PerfMetricSettings;
  let retrieve: Retrieve;

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

  const useBody: UseBody = ({ retrieve: _retrieve, settings }) => {
    retrieve = _retrieve;
    retrieve.lunchedAtEffectStage = effectStage = false;
    relayingSettings = alterPayloadToCatchEffectStage(settings);
  };

  return { ReleaseUsePerMetric, useBody };

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
}> = ({
  measureFromCreated = false,
  effectSettings = { measureAtEffectStage: false },
  id,
  retrieve,
}) => {
  const [start, getStarted] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!start) {
      getStarted(true);
      return;
    }

    // eslint-disable-next-line consistent-return
    return () => {
      getStarted(false);
    };
  });

  const settings: PerfMetricSettings = { id, measureFromCreated, ...effectSettings };
  const [{ ReleaseUsePerMetric, useBody }] = useState(createNestedComponents);
  useBody({ retrieve, settings });

  return <StrictMode>{start ? <ReleaseUsePerMetric /> : null}</StrictMode>;
};
