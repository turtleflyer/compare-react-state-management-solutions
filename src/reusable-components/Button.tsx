import type { CSSProperties, RefObject } from 'react';
import React, { forwardRef } from 'react';

const style: CSSProperties = { width: 200, height: 20, display: 'block', marginRight: 5 };

export const Button = forwardRef<
  HTMLElement,
  { callback: () => void; addStyle?: CSSProperties; name?: string }
>(function Button({ callback, addStyle = {}, name = 'start' }, ref) {
  const calcStyle = { ...style, ...addStyle };

  return (
    <button
      {...{ style: calcStyle, type: 'button', onClick: callback }}
      {...({ ref } as { ref: RefObject<HTMLButtonElement> })}
    >
      {name}
    </button>
  );
});
