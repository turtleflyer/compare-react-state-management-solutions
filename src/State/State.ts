import { getNextKey } from '@~internal/get-next-key';
import { getRandomColor } from '@~internal/random-color';
import { useState } from 'react';
import { goInterstate, Interstate } from 'use-interstate';
import type {
  AlternativeForChoice,
  AlternativeForChoiceState,
  ColorForAlternative,
  ColorForAlternativeState,
  ColorValue,
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

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export const alternativeForChoiceKeys = [0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const { initInterstate, useInterstate, readInterstate, setInterstate } = goInterstate<
  State & Interstate
>();

export const createColorForAlternativeEntry = (
  choice: PixelChoice
): [ColorForAlternative, ColorValue] => [
  getNextKey(`${colorForAlternativeKeyPrefix}-${choice}` as ColorForAlternative),
  getRandomColor(DEF_COLOR),
];

const initialState = {
  [choiceForPixelPlaceholderKey]: 0,
  [gridSizeKey]: DEF_GRID_SIZE,
  [rememberActiveChoiceKey]: 0,
} as State;

initInterstate({ ...initialState, ...createColorForChoiceDefState() });
const createFreshKey = (): string => getNextKey('refresh-key');

export const useRefreshApp = (): [string, ({ gridSize }: { gridSize: number }) => void] => {
  const [key, setKey] = useState(createFreshKey);

  const commandToCreateFreshKey = ({ gridSize }: { gridSize: number }): void => {
    initInterstate({
      ...initialState,
      ...createColorForChoiceDefState(),
      [gridSizeKey]: gridSize,
    });

    setKey(createFreshKey);
  };

  return [key, commandToCreateFreshKey];
};

function createColorForChoiceDefState(): ColorForAlternativeState & AlternativeForChoiceState {
  return alternativeForChoiceKeys.reduce((accState, k, i) => {
    const colorForAlternativeEntry = createColorForAlternativeEntry(i as PixelChoice);

    return {
      ...accState,
      ...Object.fromEntries([colorForAlternativeEntry, [k, colorForAlternativeEntry[0]]]),
    };
  }, {} as ColorForAlternativeState & AlternativeForChoiceState);
}
