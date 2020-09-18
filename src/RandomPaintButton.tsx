import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Button } from './Button';
import { placeholderAtomForPixelControl, SQUARE_SIZE, storeAtomsMethods } from './State';

export const RandomPaintButton: FC = () => {
  const [randomIndexToPaint, setIndex] = useState(placeholderAtomForPixelControl);
  const paintRandomPixel = useSetRecoilState(randomIndexToPaint);

  useEffect(() => {
    if (randomIndexToPaint) {
      paintRandomPixel((prev) => (1 - prev) as 0 | 1);
    }
  }, [paintRandomPixel, randomIndexToPaint]);

  function randomPaint() {
    const randomIndex = Math.floor(Math.random() * SQUARE_SIZE ** 2);
    setIndex(storeAtomsMethods.get(randomIndex));
  }

  return (
    <Button
      {...{
        callback: randomPaint,
        name: 'paint random pixel',
        addStyle: { width: '300px' },
      }}
    />
  );
};
