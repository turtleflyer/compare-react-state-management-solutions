import {
  createOnFocus,
  useBlockingState,
} from '@compare-react-state-management-solutions/performance-info';
import type { ChangeEventHandler, CSSProperties, FC, FormEventHandler } from 'react';
import React, { useRef, useState } from 'react';

export const InputField: FC<{
  label: string;
  onSubmit?: (v: string, setValue: (v: string) => void) => void;
  defValue: string;
  width?: number;
  addStyle?: CSSProperties;
  insertElementBefore?: JSX.Element;
  insertElementAfter?: JSX.Element;
}> = ({
  label,
  onSubmit,
  defValue,
  width = 65,
  addStyle,
  insertElementBefore,
  insertElementAfter,
}) => {
  const formStyle: CSSProperties = { display: 'block', ...addStyle };
  const inputFieldStyle: CSSProperties = { width };

  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(defValue);
  const { toBlock } = useBlockingState();
  const onFocus = createOnFocus<HTMLInputElement>(toBlock);

  const onChange: ChangeEventHandler<HTMLInputElement> = toBlock
    ? () => null
    : ({ target: { value } }) => setInputValue(value);

  const onSubmitForm: FormEventHandler = toBlock
    ? (event) => event.preventDefault()
    : (event) => {
        event.preventDefault();
        inputRef.current?.blur();
        onSubmit?.(inputValue, setInputValue);
      };

  return (
    <form
      {...{
        onSubmit: onSubmitForm,
        style: formStyle,
      }}
    >
      {insertElementBefore}
      <label>
        {label}
        <input
          {...{
            type: 'text',
            onChange,
            value: inputValue,
            style: inputFieldStyle,
            onFocus,
            ref: inputRef,
          }}
        />
      </label>
      {insertElementAfter}
    </form>
  );
};
