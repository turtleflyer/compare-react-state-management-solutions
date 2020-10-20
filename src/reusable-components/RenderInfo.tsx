import type { CSSProperties, FC } from 'react';
import React from 'react';

const style: CSSProperties = {
  display: 'inline-flex',
  height: 20,
  fontSize: '0.8rem',
  color: 'white',
  padding: '1px 3px',
  backgroundColor: 'gray',
  borderRadius: 5,
};

export const RenderInfo: FC<{ duration: number | null }> = ({ duration }) =>
  duration !== null ? (
    <div {...{ style }}>{`Render time: ${Math.round(duration)} ms`}</div>
  ) : (
    <div {...{ style: { ...style, backgroundColor: 'transparent' } }} />
  );
