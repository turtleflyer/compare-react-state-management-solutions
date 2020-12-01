import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { PerformanceInfo } from '../reusable-components/PerformanceInfo';
import { DEF_PIXELS_PERCENT_TO_PAINT, gridSizeAtom, useInterstate } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

export const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  const setChoice = useInterstate(...pixelChoiceAtom).set();

  useEffect(() => {
    setChoice((prevChoice) => (1 - prevChoice) as PixelChoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export const MassivePaintButton: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();
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
    const pixelsAtoms: ChoiceForPixelAtom[] = [];
    for (let i = 0; i < pixelsNumberToPaint; i++) {
      let atom: ChoiceForPixelAtom;
      do {
        atom = drawPixelToPaint(allPixelsNumber);
      } while (pixelsAtoms.includes(atom));
      pixelsAtoms.push(atom);
    }
    // eslint-disable-next-line react/jsx-key
    setPixelsToPaint(pixelsAtoms.map((a) => <PixelToPaint {...{ pixelChoiceAtom: a }} />));
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
