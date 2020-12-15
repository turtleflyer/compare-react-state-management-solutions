import { drawPixels } from '@~internal/draw-pixels';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { DEF_PIXELS_PERCENT_TO_PAINT, gridSizeAtom } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { buttonContainerStyle } from './styles';

const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  const setChoice = useSetRecoilState(pixelChoiceAtom);

  useEffect(() => {
    setChoice((prevChoice) => (1 - prevChoice) as PixelChoice);
  }, [setChoice]);

  return <></>;
};

export const MassivePaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ReactElement[]>([]);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels)), [
    pixelsToPaint,
  ]);

  function randomPaint() {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= 100 ? checkPercent : 0;
    setPercentInput(`${percent}`);

    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / 100;

    setPixelsToPaint(
      drawPixels(allPixelsNumber, pixelsNumberToPaint).map((p) => (
        // eslint-disable-next-line react/jsx-key
        <PixelToPaint
          {...{
            pixelChoiceAtom:
              storeAtomsMethods.get(p) ??
              (() => {
                throw Error('It must be defined');
              })(),
          }}
        />
      ))
    );
  }

  function percentCallback(e: ChangeEvent<HTMLInputElement>) {
    const {
      target: { value: input },
    } = e;
    setPercentInput(input);
  }

  return (
    <>
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
      {pixelsToPaint}
    </>
  );
};
