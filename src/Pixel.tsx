import React, { memo } from 'react';
import type { CSSProperties, FC } from 'react';
import { useRecoilValue } from 'recoil';
import { PIXEL_SIZE } from './constants';
import type { RecoilStringState } from './constants';

const pixelSizeString = `${PIXEL_SIZE}px`;

const style: CSSProperties = { height: pixelSizeString, width: pixelSizeString };

// eslint-disable-next-line react/display-name
export const Pixel: FC<{ stateAtom: RecoilStringState }> = memo(({ stateAtom }) => {
  const color = useRecoilValue(stateAtom);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
});
