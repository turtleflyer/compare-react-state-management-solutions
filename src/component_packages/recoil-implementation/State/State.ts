import { DEF_GRID_SIZE } from '@compare-react-state-management-solutions/control-panel';
import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useState } from 'react';
import type { RecoilState } from 'recoil';
import { atom } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  AlternativeForChoiceAtom,
  Atom,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  PixelChoice,
} from './StateInterface';
import {
  alternativeForChoiceKeyPrefixBase,
  choiceForPixelPlaceholderKey,
  colorForAlternativeKeyPrefix,
  gridSizeKey,
  rememberActiveChoiceKey,
} from './StateInterface';

export const DEF_COLOR = '#AAAAAA';

export const createColorForAlternativeAtom = (choice: PixelChoice): Atom<ColorForAlternative> =>
  getNextAtom(
    `${colorForAlternativeKeyPrefix}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );

export const choiceForPixelPlaceholderAtom = atom({
  key: choiceForPixelPlaceholderKey,
  default: 0,
}) as ChoiceForPixelAtom;

export const colorForAlternativePlaceholderAtom = atom({
  key: colorForAlternativeKeyPrefix,
  default: DEF_COLOR,
}) as ColorForAlternativeAtom;

let gridSizeAtom = getNextAtom(gridSizeKey, DEF_GRID_SIZE);
export const getGridSizeAtom = (): RecoilState<number> => gridSizeAtom;
export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoiceKey, default: 0 });

const alternativeForChoiceKeyPrefixes = ([0, 1] as const).map(
  (c) => `${alternativeForChoiceKeyPrefixBase}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const createAlternativeForChoiceAtoms = (): [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
] =>
  alternativeForChoiceKeyPrefixes.map((key, i) =>
    getNextAtom(key, { atom: createColorForAlternativeAtom(i as PixelChoice) })
  ) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

let alternativeForChoiceAtoms = createAlternativeForChoiceAtoms();

export const getAlternativeForChoiceAtoms = (): [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
] => alternativeForChoiceAtoms;

const createFreshKey = (): string => getNextKey('refresh-key');

export const useRefreshApp = (): [string, ({ gridSize }: { gridSize: number }) => void] => {
  const [refreshKey, createKey] = useState(createFreshKey);

  const commandToCreateRefreshKey = ({ gridSize }: { gridSize: number }) => {
    alternativeForChoiceAtoms = createAlternativeForChoiceAtoms();
    gridSizeAtom = getNextAtom(gridSizeKey, gridSize);
    createKey(createFreshKey);
  };

  return [refreshKey, commandToCreateRefreshKey];
};