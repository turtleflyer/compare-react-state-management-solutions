import React, { memo } from 'react';
import type { CSSProperties, FC } from 'react';

const style: CSSProperties = { width: '100px', height: '20px', display: 'block', margin: '5px' };

export const Button: FC<{ callback: () => void; addStyle?: CSSProperties; name?: string }> = memo(
  // eslint-disable-next-line prefer-arrow-callback
  function Button({ callback, addStyle = {}, name = 'start' }) {
    const calcStyle = { ...style, ...addStyle };

    return <button {...{ style: calcStyle, type: 'button', onClick: callback }}>{name}</button>;
  }
);
