import type { ChangeEvent, CSSProperties, FC } from 'react';
import React from 'react';

export const InputField: FC<{
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  width?: number;
  addStyle?: CSSProperties;
}> = ({ label, onChange, value = '', width = 65, addStyle = {} }) => {
  const style: CSSProperties = { width };
  return (
    <form {...{ style: { display: 'block', ...addStyle } }}>
      <label>
        {label}
        <input {...{ type: 'text', onChange, value, style }} />
      </label>
    </form>
  );
};
