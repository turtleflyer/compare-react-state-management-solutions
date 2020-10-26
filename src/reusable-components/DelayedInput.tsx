import { useMultiState } from '@smart-hooks/use-multi-state';
import type { ChangeEvent, CSSProperties, FC } from 'react';
import React, { useRef } from 'react';
import { INPUT_WAITING_DELAY } from '../State/State';
import { InputField } from './InputField';
import { Spinner } from './Spinner';

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

  interface InputState {
    inputValue: string;
    showSpin: boolean;
  }
  const [inputState, setInputState] = useMultiState<InputState>({
    inputValue: value,
    showSpin: false,
  });

  function waitDelay(input: string) {
    const {
      current: records,
      current: { activeTimeoutId },
    } = keepDelayedInputRecords;

    setInputState.showSpin(true);

    if (activeTimeoutId) {
      clearTimeout(activeTimeoutId);
    }

    records.activeTimeoutId = setTimeout(() => {
      setInputState.showSpin(false);
      records.activeTimeoutId = undefined;

      inputCallback(input);
    }, INPUT_WAITING_DELAY);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const input = e.target.value;
    setInputState.inputValue(input);
    waitDelay(input);
  }

  return (
    <div {...{ style: { display: 'flex', alignItems: 'center', ...addStyle } }}>
      <InputField
        {...{
          label,
          onChange,
          value: inputState.inputValue,
          width,
          addStyle: { marginRight: 10 },
        }}
      />
      <Spinner {...{ toShow: inputState.showSpin }} />
    </div>
  );
};
