import { Button } from '@~internal/control-components/Button';
import { InputField } from '@~internal/control-components/InputField';
import { drawPixels } from '@~internal/draw-pixels';
import { PerformanceInfo } from '@~internal/performance-info';
import { usePerfObserver } from '@~internal/use-perf-observer';
import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { DEF_PIXELS_PERCENT_TO_PAINT, gridSizeAtom } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { storeAtomsMethods } from '../State/storeAtomsMethods';
import { buttonContainerStyle } from './styles';

const ONE_HUNDRED_PERCENT = 100;
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

  const randomPaint = (): void => {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= ONE_HUNDRED_PERCENT ? checkPercent : 0;
    setPercentInput(`${percent}`);
    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / ONE_HUNDRED_PERCENT;

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
  };

  const percentCallback = ({ target: { value: input } }: ChangeEvent<HTMLInputElement>): void => {
    setPercentInput(input);
  };

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
