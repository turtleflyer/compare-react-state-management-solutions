import { useInterstate } from '@smart-hooks/use-interstate';
import React, { memo } from 'react';
import type { CSSProperties } from 'react';
import { PIXEL_SIZE } from './env';

const pixelSizeString = `${PIXEL_SIZE}px`;

const style: CSSProperties = { height: pixelSizeString, width: pixelSizeString };

// eslint-disable-next-line react/display-name
export const Pixel = memo<{ stateKey: string }>(({ stateKey }) => {
  const [useSubscribe] = useInterstate<string>(stateKey);

  const color = useSubscribe();
  const alteredStyle = { ...style, backgroundColor: color };
  return <div {...{ style: alteredStyle }} />;
});
