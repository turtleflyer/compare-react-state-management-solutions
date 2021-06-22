import {
  createOnFocus,
  useBlockingState,
} from '@compare-react-state-management-solutions/performance-info';
import type { ButtonHTMLAttributes, CSSProperties, FC, MouseEventHandler } from 'react';
import React from 'react';

const style: CSSProperties = { width: 200, height: 20, display: 'block', marginRight: 5 };

export const Button: FC<{
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
  addStyle?: CSSProperties;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  name?: string;
}> = ({ onClick: originalOnClick, addStyle, type = 'button', name = 'start' }) => {
  const calcStyle = { ...style, ...addStyle };

  const { toBlock } = useBlockingState();
  const onFocus = createOnFocus<HTMLButtonElement>(toBlock);

  const onClick: MouseEventHandler<HTMLButtonElement> | undefined = toBlock
    ? (event) => event.preventDefault()
    : originalOnClick ?? undefined;

  return (
    <button
      {...{
        style: calcStyle,
        type,
        onClick,
        onFocus,
      }}
    >
      {name}
    </button>
  );
};
