import type { CSSProperties, FC } from 'react';
import React from 'react';

const baseStyle: CSSProperties = {
  width: 5,
  height: 5,
  marginRight: 5,
  borderRadius: '100%',
  backgroundColor: '#999',
  animationName: 'jump-dot',
  animationDuration: '0.5s',
  animationIterationCount: 'infinite',
};
export const Spinner: FC = () => (
  <div {...{ style: { display: 'flex' } }}>
    <div {...{ style: { ...baseStyle, animationDelay: '0s' } }} />
    <div {...{ style: { ...baseStyle, animationDelay: '0.1s' } }} />
    <div {...{ style: { ...baseStyle, animationDelay: '0.2s' } }} />
  </div>
);
