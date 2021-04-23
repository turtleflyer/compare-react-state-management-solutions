import type { ButtonHTMLAttributes, CSSProperties, FC, MouseEventHandler } from 'react';
import React from 'react';

const style: CSSProperties = { width: 200, height: 20, display: 'block', marginRight: 5 };

export const Button: FC<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
  addStyle?: CSSProperties;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  name?: string;
}> = ({ onClick, addStyle, type = 'button', name = 'start' }) => {
  const calcStyle = { ...style, ...addStyle };

  return <button {...{ style: calcStyle, type, ...(onClick ? { onClick } : null) }}>{name}</button>;
};
