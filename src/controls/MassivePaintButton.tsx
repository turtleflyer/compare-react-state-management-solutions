import { Button } from '@~internal/control-components/Button';
import { InputField } from '@~internal/control-components/InputField';
import { drawPixels } from '@~internal/draw-pixels';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useState } from 'react';
import { DEF_PIXELS_PERCENT_TO_PAINT, readInterstate, setInterstate } from '../State/State';
import type { PixelChoice } from '../State/StateInterface';
import { gridSizeKey } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { buttonContainerStyle } from './styles';

const ONE_HUNDRED_PERCENT = 100;
const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

export const MassivePaintButton: FC = () => {
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  const randomPaint = (): void => {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= ONE_HUNDRED_PERCENT ? checkPercent : 0;
    setPercentInput(`${percent}`);
    const allPixelsNumber = readInterstate(gridSizeKey) ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / ONE_HUNDRED_PERCENT;

    drawPixels(allPixelsNumber, pixelsNumberToPaint).map((p) => {
      setInterstate(
        storeKeysMethods.get(p) ??
          (() => {
            throw Error('It must be defined');
          })(),
        (prevChoice) => (1 - prevChoice) as PixelChoice
      );
    });
  };

  const percentCallback = ({ target: { value: input } }: ChangeEvent<HTMLInputElement>): void => {
    setPercentInput(input);
  };

  return (
    <div>
      <div {...{ style: buttonContainerStyle }}>
        <Button
          {...{
            callback: randomPaint,
            name: 'paint n% random pixels',
          }}
        />
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
