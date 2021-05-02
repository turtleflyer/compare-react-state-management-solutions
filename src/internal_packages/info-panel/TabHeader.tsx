import type { CSSProperties, FC } from 'react';
import React from 'react';

const style: CSSProperties = {
  borderBottom: '20px solid',
  borderLeft: '15px solid transparent',
  borderRight: '15px solid transparent',
  boxSizing: 'content-box',
  height: 0,
  width: 40,
  textAlign: 'center',
  fontWeight: 500,
  cursor: 'default',
};

export const TabHeader: FC<{
  name: string;
  color: string;
  onClick: () => void;
  addStyle?: CSSProperties;
}> = ({ name, color, onClick, addStyle = {} }) => (
  <div
    {...{
      style: { ...style, ...addStyle, borderBottomColor: color },
      role: 'button',
      tabIndex: 0,
      onClick,
    }}
    onKeyPress={onClick}
  >
    {name}
  </div>
);
