import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import type { ColorForAlternativeAtom } from '../State/StateInterface';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel: FC<{ altControlAtom: ColorForAlternativeAtom }> = ({ altControlAtom }) => {
  const color = useRecoilValue(altControlAtom);
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
};
