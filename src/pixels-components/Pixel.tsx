import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useInterstate } from '../State/State';
import type { ColorForAlternativeAtom } from '../State/StateInterface';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel: FC<{ altControlAtom: ColorForAlternativeAtom }> = ({ altControlAtom }) => {
  const color = useInterstate(...altControlAtom).get();
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
};
