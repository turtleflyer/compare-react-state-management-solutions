import type { ChangeEvent, CSSProperties, FC, ReactElement } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { drawPixelToPaint } from '../helpers/drawPixelToPaint';
import { Button } from '../reusable-components/Button';
import { InputField } from '../reusable-components/InputField';
import { DEF_PIXELS_PERCENT_TO_PAINT, gridSizeAtom } from '../State/State';
import { ChoiceForPixelAtom, PixelChoice } from '../State/StateInterface';

const containerStyle: CSSProperties = { display: 'flex', margin: '5px' };
const buttonStyle: CSSProperties = { margin: '0 5px 0 0' };

export const PixelToPaint: FC<{ pixelChoiceAtom: ChoiceForPixelAtom }> = ({ pixelChoiceAtom }) => {
  const setChoice = useSetRecoilState(pixelChoiceAtom);

  useEffect(() => {
    setChoice((prevChoice) => (1 - prevChoice) as PixelChoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export const MassivePaintButton: FC = () => {
  const percentRecord = useRef({ percent: DEF_PIXELS_PERCENT_TO_PAINT });

  const gridSize = useRecoilValue(gridSizeAtom);
  const [percentInput, setPercentInput] = useState(`${percentRecord.current.percent}`);
  const [pixelsToPaint, setPixelsToPaint] = useState<ReactElement[]>([]);

  useEffect(() => setPixelsToPaint((prevPixels) => (prevPixels.length > 0 ? [] : prevPixels)), [
    pixelsToPaint,
  ]);

  const randomPaint: () => void = useCallback(() => {
    const checkPercent = parseInt(percentInput, 10);
    if (checkPercent > 0 && checkPercent <= 100) {
      percentRecord.current.percent = checkPercent;
    } else {
      setPercentInput(`${percentRecord.current.percent}`);
    }

    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percentRecord.current.percent) / 100;
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
  }, [gridSize, percentInput]);

  const percentCallback = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: input },
    } = e;
    setPercentInput(input);
  }, []);

  return (
    <>
      <div {...{ style: containerStyle }}>
        <Button
          {...{
            callback: randomPaint,
            name: 'paint n% random pixels',
            addStyle: buttonStyle,
          }}
        />
        <InputField {...{ label: 'n: ', value: percentInput, onChange: percentCallback }} />
      </div>
      {pixelsToPaint}
    </>
  );
};
