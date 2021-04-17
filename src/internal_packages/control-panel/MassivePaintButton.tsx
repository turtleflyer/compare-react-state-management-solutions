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

export interface PaintRandomPixels {
  paintRandomPixels: (percentage: number) => void;
}

export const MassivePaintButton: FC<PaintRandomPixels> = ({ paintRandomPixels }) => {
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  const startPaint = (): void => {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percentage = checkPercent >= 0 && checkPercent <= ONE_HUNDRED_PERCENT ? checkPercent : 0;
    setPercentInput(`${percentage}`);
    paintRandomPixels(percentage);
  };

  const percentCallback = ({ target: { value: input } }: ChangeEvent<HTMLInputElement>): void => {
    setPercentInput(input);
  };

  return (
    <div>
      <div {...{ style: buttonContainerStyle }}>
        <Button {...{ callback: startPaint, name: 'paint n% random pixels' }} />
        <InputField {...{ label: 'n: ', value: percentInput, onChange: percentCallback }} />
      </div>
      <div {...{ style: renderInfoContainerStyle }}>
        <WrapDisplay>
          <PerformanceInfo {...{ data: null }} />
        </WrapDisplay>
      </div>
    </div>
  );
};
