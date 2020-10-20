import type { CSSProperties, FC } from 'react';
import React from 'react';

const style: CSSProperties = { width: 200, height: 20, display: 'block', marginRight: 5 };

export const Button: FC<{ callback: () => void; addStyle?: CSSProperties; name?: string }> = ({
  callback,
  addStyle = {},
  name = 'start',
}) => {
  const calcStyle = { ...style, ...addStyle };

  return <button {...{ style: calcStyle, type: 'button', onClick: callback }}>{name}</button>;
};
