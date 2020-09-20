import { useMultiState } from '@smart-hooks/use-multi-state';
import type { ChangeEvent, FC } from 'react';
import React, { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { InputField } from '../reusable-components/InputField';
import { Spinner } from '../reusable-components/Spinner';
import { DEF_GRID_SIZE, gridSizeState, INPUT_WAITING_DELAY } from '../State/State';

export const ChooseGrid: FC = () => {
  interface InnerState {
    activeTimeoutId?: NodeJS.Timeout;
  }
  const innerStateRecord = useRef<InnerState>({});

  const setGridSize = useSetRecoilState(gridSizeState);

  interface ChooseGridState {
    inputValue: number | string;
    showSpin: boolean;
  }
  const [chooseGridState, setChooseGridState] = useMultiState<ChooseGridState>({
    inputValue: DEF_GRID_SIZE,
    showSpin: false,
  });

  function waitDelay(input: string | number) {
    const {
      current: innerState,
      current: { activeTimeoutId },
    } = innerStateRecord;

    setChooseGridState.showSpin(true);

    if (activeTimeoutId) {
      clearTimeout(activeTimeoutId);
    }

    innerState.activeTimeoutId = setTimeout(() => {
      setChooseGridState.showSpin(false);
      innerState.activeTimeoutId = undefined;

      const gridSize = parseInt(input.toString(), 10);
      setGridSize(gridSize);
      setChooseGridState.inputValue(gridSize);
    }, INPUT_WAITING_DELAY);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const input = e.target.value;
    setChooseGridState.inputValue(input);
    waitDelay(input);
  }

  return (
    <div {...{ style: { display: 'flex', flexDirection: 'row' } }}>
      <div {...{ style: { marginRight: 10 } }}>
        <InputField
          {...{
            label: 'input grid size: ',
            onChange,
            value: chooseGridState.inputValue,
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
          {chooseGridState.showSpin && <Spinner />}
        </div>
      </div>
    </div>
  );
};
