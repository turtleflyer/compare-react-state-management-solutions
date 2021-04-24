import { PerformanceInfo } from '@compare-react-state-management-solutions/performance-info';
import { usePerfObserver } from '@compare-react-state-management-solutions/use-perf-observer';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { Button } from './Button';
import { InputField } from './InputField';
import { buttonContainerStyle } from './styles';

export const ONE_HUNDRED_PERCENT = 100;
const DEF_PIXELS_PERCENT_TO_PAINT = 30;
const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

type MassivePaintCallback = (percentage: number) => void;

export type PaintRandomPixels =
  | {
      paintRandomPixels: MassivePaintCallback;
      usePaintRandomPixels?: undefined;
    }
  | {
      usePaintRandomPixels:
        | (() => MassivePaintCallback)
        | (() => [MassivePaintCallback, JSX.Element[]]);
      paintRandomPixels?: undefined;
    };

export const MassivePaintButton: FC<PaintRandomPixels> = (props) => {
  let paintRandomPixels: MassivePaintCallback;
  let painterComponents: JSX.Element[];

  if (props.paintRandomPixels) {
    [paintRandomPixels, painterComponents] = [props.paintRandomPixels, []];
  } else {
    const checkResultForPaintRandomPixels = props.usePaintRandomPixels();

    [paintRandomPixels, painterComponents] = Array.isArray(checkResultForPaintRandomPixels)
      ? checkResultForPaintRandomPixels
      : [checkResultForPaintRandomPixels, []];
  }

  const [percentsInput, setPercentsInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  const startPaint = (): void => {
    startMeasure();
    const percentsNumber = parseInt(percentsInput, 10);

    percentsNumber >= 0 && percentsNumber <= ONE_HUNDRED_PERCENT
      ? paintRandomPixels(percentsNumber)
      : setPercentsInput('0');
  };

  const percentCallback = ({ target: { value: input } }: ChangeEvent<HTMLInputElement>): void => {
    setPercentsInput(input);
  };

  return (
    <>
      <div>
        <InputField
          {...{
            label: 'n: ',
            value: percentsInput,
            onChange: percentCallback,
            onSubmit: startPaint,
            width: 40,
            addStyle: buttonContainerStyle,
            insertElementBefore: <Button {...{ type: 'submit', name: 'paint n% random pixels' }} />,
          }}
        />
        <div {...{ style: renderInfoContainerStyle }}>
          <WrapDisplay>
            <PerformanceInfo {...{ data: null }} />
          </WrapDisplay>
        </div>
      </div>
      {painterComponents}
    </>
  );
};
