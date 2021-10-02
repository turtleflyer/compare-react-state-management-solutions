import {
  PerformanceInfo,
  useAddRefToCalculateArea,
  useSetStateToBlock,
} from '@compare-react-state-management-solutions/performance-info';
import { usePerfMetric } from '@compare-react-state-management-solutions/use-perf-metric';
import type { CSSProperties, FC, ReactElement } from 'react';
import { useState } from 'react';
import { Button } from './Button';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export const ONE_HUNDRED_PERCENT = 100;
const DEF_PIXELS_PERCENT_TO_PAINT = 30;
const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

type MassivePaintCallback = (percentage: number) => void;

export type PaintRandomPixelsProps = (
  | {
      paintRandomPixels: MassivePaintCallback;
      usePaintRandomPixels?: undefined;
    }
  | {
      usePaintRandomPixels:
        | (() => MassivePaintCallback)
        | (() => [MassivePaintCallback, ReactElement[]]);
      paintRandomPixels?: undefined;
    }
) & { moduleName: string };

export const MassivePaintButton: FC<PaintRandomPixelsProps> = (props) => {
  const { moduleName } = props;
  let paintRandomPixels: MassivePaintCallback;
  let painterComponents: ReactElement[] | null;
  const addRef = useAddRefToCalculateArea();
  const setStateToBlock = useSetStateToBlock();

  if (props.paintRandomPixels) {
    [paintRandomPixels, painterComponents] = [props.paintRandomPixels, null];
  } else {
    const checkResultForPaintRandomPixels = props.usePaintRandomPixels();

    [paintRandomPixels, painterComponents] = Array.isArray(checkResultForPaintRandomPixels)
      ? checkResultForPaintRandomPixels
      : [checkResultForPaintRandomPixels, null];
  }

  const defPercentsInput = `${DEF_PIXELS_PERCENT_TO_PAINT}`;
  const [percentsInput, setPercentsInput] = useState(defPercentsInput);
  const { WrapMetricConsumer, measurePerformance } = usePerfMetric();

  const startPaint = (value: string, setValue: (v: string) => void): void => {
    const parsePercentsNumber = parseInt(value, 10);

    if (
      value === `${parsePercentsNumber}` &&
      parsePercentsNumber >= 0 &&
      parsePercentsNumber <= ONE_HUNDRED_PERCENT
    ) {
      setPercentsInput(value);
      setStateToBlock();

      measurePerformance({
        measureAtEffectStage: true,

        callback: () => {
          paintRandomPixels(parsePercentsNumber);
        },
      });

      return;
    }

    setValue(defPercentsInput);
  };

  return (
    <>
      <div {...{ ref: addRef }}>
        <InputField
          {...{
            label: 'n: ',
            defValue: defPercentsInput,
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
