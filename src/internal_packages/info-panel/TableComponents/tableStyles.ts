import type { CSSProperties } from 'react';

export const rowContainerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginRight: 30,
};

export const borderBottom: CSSProperties = {
  borderBottom: 'solid 0.5px',
};

export const recordStyle: CSSProperties = {
  width: '100%',
  paddingRight: 5,
};

export const recordNameStyle: CSSProperties = {
  ...recordStyle,
  fontSize: '0.8em',
  lineHeight: '1.8em',
};

export const recordNumbersStyle: CSSProperties = {
  ...recordStyle,
  textAlign: 'right',
};
