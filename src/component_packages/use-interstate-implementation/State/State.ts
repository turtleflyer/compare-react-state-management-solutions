import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useState } from 'react';
import type { Interstate } from 'use-interstate';
import { goInterstate } from 'use-interstate';
import type {
  AlternativeForChoice,
  AlternativeForChoiceState,
  ColorForAlternative,
  ColorForAlternativeState,
  PixelChoice,
  State,
} from './StateInterface';
import {
  alternativeForChoicePlaceholderKey,
  choiceForPixelPlaceholderKey,
  colorForAlternativeKeyPrefix,
  rememberActiveChoiceKey,
} from './StateInterface';

export const DEF_COLOR = '#AAAAAA';

export const alternativeForChoiceKeys = [0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const { initInterstate, useInterstate, readInterstate, setInterstate } = goInterstate<
  State & Interstate
>();

export const createColorForAlternativeForChoiceEntry = (
  choice: PixelChoice
): ColorForAlternativeState & AlternativeForChoiceState => {
  const [colorForAlternativeKey, color] = [
    getNextKey(`${colorForAlternativeKeyPrefix}-${choice}` as ColorForAlternative),
    getRandomColor(DEF_COLOR),
  ];

  return {
    [alternativeForChoiceKeys[choice]]: colorForAlternativeKey,
    [colorForAlternativeKey]: color,
  };
};

const initialState = {
  [choiceForPixelPlaceholderKey]: 0,
  [rememberActiveChoiceKey]: 0,
} as State;

interface UseRefreshStageReturn {
  gridSize: number;
  commandToRefreshStage: CommandToRefreshStage;
}

type CommandToRefreshStage = (arg: { gridSize: number }) => void;

export const useRefreshStage = ({
  defGridSize,
}: {
  defGridSize: number;
}): UseRefreshStageReturn => {
  useState(() => initAppInterstate());
  const [gridSize, setGridSize] = useState(defGridSize);

  const commandToRefreshStage: CommandToRefreshStage = ({ gridSize: nextGridSize }) => {
    setGridSize(nextGridSize);
    initAppInterstate();
  };

  return { commandToRefreshStage, gridSize };
};

function initAppInterstate() {
  initInterstate({
    ...initialState,
    ...([0, 1] as const).reduce(
      (entries, c) => ({ ...entries, ...createColorForAlternativeForChoiceEntry(c) }),
      {} as ColorForAlternativeState & AlternativeForChoiceState
    ),
  });
}
