import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useMeasurePerformance } from 'use-measure-perf';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { RenderInfo } from '../reusable-components/RenderInfo';
import { DEF_PIXELS_PERCENT_TO_PAINT, gridSizeAtom } from '../State/State';
import { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';
import { buttonContainerStyle } from './styles';

const renderInfoContainerStyle: CSSProperties = { margin: '-5px 0 0 5px', height: 20 };

export const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  const setChoice = useSetRecoilState(pixelChoiceAtom);

  useEffect(() => {
    setChoice((prevChoice) => (1 - prevChoice) as PixelChoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export const MassivePaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);
  const [percentInput, setPercentInput] = useState(`${DEF_PIXELS_PERCENT_TO_PAINT}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ReactElement[]>([]);
  const duration = useMeasurePerformance({ dependencies: [pixelsToPaint] });

  useEffect(() => setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels)), [
    pixelsToPaint,
  ]);

  function randomPaint() {
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
          <RenderInfo {...{ duration }} />
        </div>
      </div>
      {pixelsToPaint}
    </>
  );
};
