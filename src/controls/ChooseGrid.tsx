import type { FC } from 'react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { DelayedInput } from '../reusable-components/DelayedInput';
import { DEF_GRID_SIZE, gridSizeState } from '../State/State';

export const ChooseGrid: FC = () => {
  const setGridSize = useSetRecoilState(gridSizeState);

  function inputCallback(input: string, setInput: (input: string) => void) {
    const gridSize = parseInt(input, 10);
    setGridSize(gridSize);
    setInput(`${gridSize}`);
  }

  return (
    <DelayedInput {...{ label: 'input grid size: ', inputCallback, value: `${DEF_GRID_SIZE}` }} />
  );
};
