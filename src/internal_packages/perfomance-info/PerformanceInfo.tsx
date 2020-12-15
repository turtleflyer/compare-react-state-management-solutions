import { MetricsComponentProps } from '@~internal/use-perf-observer';
import type { CSSProperties, FC } from 'react';
import React from 'react';

const style: CSSProperties = {
  display: 'flex',
  width: 170,
  height: 20,
  fontSize: '12px',
  color: 'white',
  padding: '1px 3px',
  backgroundColor: 'gray',
  borderRadius: 5,
  justifyContent: 'center',
};

export const PerformanceInfo: FC<MetricsComponentProps> = ({ data, status }) => {
  if (status === 'done' && data) {
    const { TTI, TBT } = data;
    return <div {...{ style }}>{`TTI: ${Math.round(TTI)}ms - TBT: ${Math.round(TBT)}ms`}</div>;
  }

  if (status === 'pending') {
    return <div {...{ style }}>performance measuring...</div>;
  }

  if (status === 'error') {
    return <div {...{ style }}>error</div>;
  }

  return <div {...{ style: { ...style, backgroundColor: 'transparent' } }} />;
};
