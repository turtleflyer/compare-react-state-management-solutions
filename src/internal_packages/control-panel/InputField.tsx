import type { ChangeEventHandler, CSSProperties, FC, FormEventHandler } from 'react';
import React from 'react';

export const InputField: FC<{
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  value?: string | number;
  width?: number;
  addStyle?: CSSProperties;
  insertElementBefore?: JSX.Element;
  insertElementAfter?: JSX.Element;
}> = ({
  label,
  onChange,
  onSubmit,
  value = '',
  width = 65,
  addStyle,
  insertElementBefore,
  insertElementAfter,
}) => {
  const style: CSSProperties = { width };
  return (
    <form
      {...{
        onSubmit: (e) => {
          e.preventDefault();
          onSubmit?.(e);
        },
        style: { display: 'block', ...addStyle },
      }}
    >
      {insertElementBefore}
      <label>
        {label}
        <input {...{ type: 'text', onChange, value, style }} />
      </label>
      {insertElementAfter}
    </form>
  );
};
