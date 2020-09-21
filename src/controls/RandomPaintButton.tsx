import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import { gridSizeState, placeholderAtomForPixelControl } from '../State/State';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const RandomPaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeState);

  const [randomAtomToPaint, setIndex] = useState([placeholderAtomForPixelControl]);
  const paintRandomPixel = useSetRecoilState(randomAtomToPaint[0]);

  useEffect(() => {
    if (randomAtomToPaint) {
      paintRandomPixel((prev) => (1 - prev) as 0 | 1);
    }
  }, [paintRandomPixel, randomAtomToPaint]);

  function randomPaint() {
    const randomIndex = Math.floor(Math.random() * gridSize ** 2);
    setIndex([storeAtomsMethods.get(randomIndex)]);
  }

  return (
    <Button
      {...{
        callback: randomPaint,
        name: 'paint random pixel',
      }}
    />
  );
};
