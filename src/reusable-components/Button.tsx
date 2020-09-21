import type { CSSProperties, FC } from 'react';
import React from 'react';

const style: CSSProperties = { width: '200px', height: '20px', display: 'block', margin: '5px' };

export const Button: FC<{ callback: () => void; addStyle?: CSSProperties; name?: string }> = ({
  callback,
  addStyle = {},
  name = 'start',
}) => {
  const calcStyle = { ...style, ...addStyle };

  return <button {...{ style: calcStyle, type: 'button', onClick: callback }}>{name}</button>;
};
