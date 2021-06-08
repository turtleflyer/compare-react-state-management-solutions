import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useState } from 'react';
import { goInterstate, Interstate } from 'use-interstate';
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
  gridSizeKey,
  rememberActiveChoiceKey,
} from './StateInterface';

export const DEF_COLOR = '#AAAAAA';

export const alternativeForChoiceKeys = [0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const { initInterstate, useInterstate, readInterstate, setInterstate } =
  goInterstate<State & Interstate>();

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

const createFreshKey = (): string => getNextKey('refresh-key');

export const useRefreshApp = ({
  defGridSize,
}: {
  defGridSize: number;
}): [string, ({ gridSize }: { gridSize: number }) => void] => {
  useState(() => initAppInterstate(defGridSize));
  const [key, setKey] = useState(createFreshKey);

  const commandToCreateFreshKey = ({ gridSize }: { gridSize: number }): void => {
    initAppInterstate(gridSize);
    setKey(createFreshKey);
  };

  return [key, commandToCreateFreshKey];
};

function initAppInterstate(gridSize: number) {
  initInterstate({
    ...initialState,
    ...([0, 1] as const).reduce(
      (entries, c) => ({ ...entries, ...createColorForAlternativeForChoiceEntry(c) }),
      {} as ColorForAlternativeState & AlternativeForChoiceState
    ),
    [gridSizeKey]: gridSize,
  });
}
