import { PerformanceInfo } from 'performance-info';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { switchPixelChoiceAction } from '../State/actions';
import { getGridSize } from '../State/selectors';
import { DEF_PIXELS_PERCENT_TO_PAINT } from '../State/State';
import type { ChoiceForPixel } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

export const MassivePaintButton: FC = () => {
  const gridSize = useSelector(getGridSize);
  const dispatch = useDispatch();
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ChoiceForPixel[]>([]);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => {
    pixelsToPaint.forEach((p) => dispatch(switchPixelChoiceAction(p)));
    setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels));
  }, [dispatch, pixelsToPaint]);

  function randomPaint() {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= 100 ? checkPercent : 0;
    setPercentInput(`${percent}`);

    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / 100;
    const pixels: ChoiceForPixel[] = [];

    for (let i = 0; i < pixelsNumberToPaint; i++) {
      let pixel: ChoiceForPixel;
      do {
        pixel = drawPixelToPaint(allPixelsNumber);
      } while (pixels.includes(pixel));
      pixels.push(pixel);
    }

    setPixelsToPaint(pixels);
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
};
