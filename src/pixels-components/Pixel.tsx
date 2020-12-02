import type { CSSProperties, FC } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import { getColorForAlternative } from '../State/selectors';
import type { ColorForAlternative, ColorValue, State } from '../State/StateInterface';

const style: CSSProperties = { height: '100%', width: '100%' };

export const Pixel = connect(
  (state: State, { altControl }: { altControl: ColorForAlternative }) => ({
    color: getColorForAlternative(state, altControl),
  })
)(function Pixel({ color }) {
  const alteredStyle = { ...style, backgroundColor: color };

  return <div {...{ style: alteredStyle }} />;
} as FC<{ color: ColorValue }>);
