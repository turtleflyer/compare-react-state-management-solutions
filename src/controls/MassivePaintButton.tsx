import { drawPixels } from '@~internal/draw-pixels';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { switchPixelChoiceAction } from '../State/actions';
import { getGridSize } from '../State/selectors';
import { DEF_PIXELS_PERCENT_TO_PAINT } from '../State/State';
import type { ChoiceForPixel, State } from '../State/StateInterface';
import { storeKeysMethods } from '../State/storeKeysMethods';
import { buttonContainerStyle } from './styles';

const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

export const MassivePaintButton = connect((state: State) => ({ gridSize: getGridSize(state) }), {
  switchPixelChoice: switchPixelChoiceAction,
})(function MassivePaintButton({ gridSize, switchPixelChoice }) {
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ChoiceForPixel[]>([]);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    pixelsToPaint.forEach((p) => switchPixelChoice(p));
    setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels));
  }, [pixelsToPaint, switchPixelChoice]);

  function randomPaint() {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= 100 ? checkPercent : 0;
    setPercentInput(`${percent}`);

    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / 100;

    setPixelsToPaint(
      drawPixels(allPixelsNumber, pixelsNumberToPaint).map(
        (p) =>
          storeKeysMethods.get(p) ??
          (() => {
            throw Error('It must be defined');
          })()
      )
    );
  }

  function percentCallback(e: ChangeEvent<HTMLInputElement>) {
    const {
      target: { value: input },
    } = e;
    setPercentInput(input);
  }

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
} as FC<{ gridSize: number; switchPixelChoice: (pixel: ChoiceForPixel) => void }>);
