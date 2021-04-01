import { PerformanceInfo } from 'performance-info';
import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { usePerfObserver } from 'use-perf-observer';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { DEF_PIXELS_PERCENT_TO_PAINT, getAtom, setInterstate, useInterstate } from '../State/State';
import type { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { gridSizeKey } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

const ONE_HUNDRED_PERCENT = 100;
const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  useEffect(() => {
    setInterstate(pixelChoiceAtom[0], (prevChoice: any) => (1 - prevChoice) as PixelChoice);
  }, [pixelChoiceAtom]);

  return <></>;
};

export const MassivePaintButton: FC = () => {
  const gridSize = useInterstate(...getAtom(gridSizeKey));
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ReactElement[]>([]);
  const [WrapDisplay, startMeasure] = usePerfObserver();

  useEffect(() => setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels)), [
    pixelsToPaint,
  ]);

  function randomPaint() {
    startMeasure();
    const checkPercent = parseInt(percentInput, 10);
    const percent = checkPercent >= 0 && checkPercent <= ONE_HUNDRED_PERCENT ? checkPercent : 0;
    setPercentInput(`${percent}`);

    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percent) / ONE_HUNDRED_PERCENT;
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
