import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useInterstate } from '../State/State';
import type { ColorForAlternative } from '../State/StateInterface';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel: FC<{ altControlKey: ColorForAlternative }> = ({ altControlKey }) => {
  const color = useInterstate(altControlKey);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
};
