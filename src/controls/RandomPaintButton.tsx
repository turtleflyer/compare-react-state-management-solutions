import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '../reusable-components/Button';
import { choiceForPixelPlaceholderAtom, gridSizeAtom } from '../State/State';
import { storeAtomsMethods } from '../State/storeAtomsMethods';

export const RandomPaintButton: FC = () => {
  const gridSize = useRecoilValue(gridSizeAtom);

  const [atomToPaint, setAtomToPaint] = useState([choiceForPixelPlaceholderAtom] as const);
  const paintRandomPixel = useSetRecoilState(atomToPaint[0]);

  useEffect(() => paintRandomPixel((prev) => (1 - prev) as 0 | 1), [paintRandomPixel, atomToPaint]);

  const randomPaint: () => void = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * gridSize ** 2);
    const atomToSet = storeAtomsMethods.get(randomIndex);
    if (!atomToSet) {
      throw Error('It should be defined');
    }
    setAtomToPaint([atomToSet]);
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
