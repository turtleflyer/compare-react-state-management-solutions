import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../reusable-components/Button';
import { choiceForPixelPlaceholderAtom, gridSizeAtom, useInterstate } from '../State/State';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const RandomPaintButton: FC = () => {
  const gridSize = useInterstate(...gridSizeAtom).get();

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useInterstate(...atomToPaint[0]).set();

  useEffect(() => paintRandomPixel((prev) => (1 - prev) as 0 | 1), [paintRandomPixel, atomToPaint]);

  const randomPaint: () => void = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * gridSize ** 2);
    setAtomToPaint([storeAtomsMethods.get(randomIndex)]);
  }, [gridSize]);

  return (
    <Button
      {...{
        callback: randomPaint,
        name: 'paint random pixel',
      }}
    />
  );
};
