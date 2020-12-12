import type { CSSProperties, FC } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getColorForAlternative } from '../State/selectors';
import type { ColorForAlternative, State } from '../State/StateInterface';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel: FC<{ altControl: ColorForAlternative }> = ({ altControl }) => {
  const color = useSelector((state: State) => getColorForAlternative(state, altControl));
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
};
