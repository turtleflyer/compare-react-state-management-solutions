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

export const RenderInfo: FC<{ duration: number | null }> = ({ duration }) =>
  duration !== null ? (
    <div {...{ style }}>{`Render time: ${Math.round(duration)} ms`}</div>
  ) : (
    <div {...{ style: { ...style, backgroundColor: 'transparent' } }} />
  );
