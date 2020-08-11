import { useInterstate } from '@smart-hooks/use-interstate';
import React, { memo } from 'react';
import type { CSSProperties } from 'react';

const style: CSSProperties = { height: '10px', width: '10px' };

// eslint-disable-next-line react/display-name
export const Pixel = memo<{ stateKey: string }>(({ stateKey }) => {
  const [useSubscribe] = useInterstate<string>(stateKey);

  const color = useSubscribe();
  const alteredStyle = { ...style, backgroundColor: color };
  return <div {...{ style: alteredStyle }} />;
});
