import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useRef, useState } from 'react';
import { InputField } from './InputField';
import { Spinner } from './Spinner';

const INPUT_WAITING_DELAY = 3000;

export const DelayedInput: FC<{
  label: string;
  inputCallback: (input: string) => void;
  value?: string;
  width?: number;
  addStyle?: CSSProperties;
}> = ({ label, inputCallback, value = '', width = 65, addStyle = {} }) => {
  interface KeepDelayedInputRecords {
    activeTimeoutId?: NodeJS.Timeout;
  }
  const keepDelayedInputRecords = useRef<KeepDelayedInputRecords>({});
  const [inputValue, setInputValue] = useState(value);
  const [showSpin, setShowSpin] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    const {
      current: records,
      current: { activeTimeoutId },
    } = keepDelayedInputRecords;
    
    setInputValue(input);
    setShowSpin(true);

    if (activeTimeoutId) {
      clearTimeout(activeTimeoutId);
    }

    records.activeTimeoutId = setTimeout(() => {
      setShowSpin(false);
      records.activeTimeoutId = undefined;

      inputCallback(input);
    }, INPUT_WAITING_DELAY);
  };

  return (
    <div {...{ style: { display: 'flex', alignItems: 'center', ...addStyle } }}>
      <InputField
        {...{
          label,
          onChange,
          value: inputValue,
          width,
          addStyle: { marginRight: 10 },
        }}
      />
      <Spinner {...{ toShow: showSpin }} />
    </div>
  );
};
