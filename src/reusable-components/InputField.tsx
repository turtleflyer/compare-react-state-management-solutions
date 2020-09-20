import type { ChangeEvent, CSSProperties, FC } from 'react';
import React from 'react';

export const InputField: FC<{
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  width?: number;
}> = ({ label, onChange, value = '', width = 65 }) => {
  const style: CSSProperties = { width };
  return (
    <form>
      <label>
        {label}
        <input {...{ type: 'text', onChange, value, style }} />
      </label>
    </form>
  );
};
