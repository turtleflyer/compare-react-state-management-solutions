import { useMultiState } from '@smart-hooks/use-multi-state';
import type { ChangeEvent, FC } from 'react';
import React, { useRef } from 'react';
import { INPUT_WAITING_DELAY } from '../State/State';
import { InputField } from './InputField';
import { Spinner } from './Spinner';

export const DelayedInput: FC<{
  label: string;
  inputCallback: (input: string) => void;
  value?: string;
  width?: number;
}> = ({ label, inputCallback, value = '', width = 65 }) => {
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
    <div {...{ style: { display: 'flex', flexDirection: 'row' } }}>
      <div {...{ style: { marginRight: 10 } }}>
        <InputField
          {...{
            label,
            onChange,
            value: inputState.inputValue,
            width,
          }}
        />
      </div>
      <div {...{ style: { position: 'relative' } }}>
        <div
          {...{
            style: {
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            },
          }}
        >
          {inputState.showSpin && <Spinner />}
        </div>
      </div>
    </div>
  );
};