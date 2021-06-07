import {
  PerformanceInfo,
  useAddRef,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export const ONE_HUNDRED_PERCENT = 100;
const DEF_PIXELS_PERCENT_TO_PAINT = 30;
const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

type MassivePaintCallback = (percentage: number) => void;

export type PaintRandomPixels = (
  | {
      paintRandomPixels: MassivePaintCallback;
      usePaintRandomPixels?: undefined;
    }
  | {
      usePaintRandomPixels:
        | (() => MassivePaintCallback)
        | (() => [MassivePaintCallback, JSX.Element[]]);
      paintRandomPixels?: undefined;
    }
) & { moduleName: string };

export const MassivePaintButton: FC<PaintRandomPixels> = (props) => {
  const { moduleName } = props;
  let paintRandomPixels: MassivePaintCallback;
  let painterComponents: JSX.Element[];
  const addRef = useAddRef();

  if (props.paintRandomPixels) {
    [paintRandomPixels, painterComponents] = [props.paintRandomPixels, []];
  } else {
    const checkResultForPaintRandomPixels = props.usePaintRandomPixels();

    [paintRandomPixels, painterComponents] = Array.isArray(checkResultForPaintRandomPixels)
      ? checkResultForPaintRandomPixels
      : [checkResultForPaintRandomPixels, []];
  }

  const [percentsInput, setPercentsInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric();

  const startPaint = (): void => {
    const percentsNumber = parseInt(percentsInput, 10);

    if (percentsNumber >= 0 && percentsNumber <= ONE_HUNDRED_PERCENT) {
      measurePerformance();
      paintRandomPixels(percentsNumber);
    } else {
      setPercentsInput('0');
    }
  };

  const percentCallback = ({ target: { value: input } }: ChangeEvent<HTMLInputElement>): void => {
    setPercentsInput(input);
  };

  return (
    <>
      <div {...{ ref: addRef }}>
        <InputField
          {...{
            label: 'n: ',
            value: percentsInput,
            onChange: percentCallback,
            onSubmit: startPaint,
            width: 40,
            addStyle: buttonContainerStyle,
            insertElementBefore: <Button {...{ type: 'submit', name: createName('n') }} />,
          }}
        />
        <div {...{ style: renderInfoContainerStyle }}>
          <WrapMetricConsumer>
            <PerformanceInfo
              // eslint-disable-next-line @typescript-eslint/no-magic-numbers
              {...{ tags: [moduleName, createName(percentsInput.padStart(3, '0'))] }}
            />
          </WrapMetricConsumer>
        </div>
      </div>
      {painterComponents}
    </>
  );
};

function createName(insert: string | number): string {
  return `paint ${insert}% random pixels`;
}
