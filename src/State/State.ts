import { getNextKey } from '@~internal/get-next-key';
import { getRandomColor } from '@~internal/random-color';
import { useState } from 'react';
import type { SetterOrUpdater } from 'recoil';
import { atom, useSetRecoilState } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoiceAtom,
  Atom,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  HoldColorForAlternativeAtom,
  PixelChoice,
} from './StateInterface';
import {
  alternativeForChoiceKeyPrefix,
  choiceForPixelPlaceholderKey,
  colorForAlternativeKeyPrefix,
  gridSizeKey,
  rememberActiveChoiceKey,
} from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

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

export const gridSizeAtom = atom({ key: gridSizeKey, default: DEF_GRID_SIZE });

export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoiceKey, default: 0 });

export const alternativeForChoiceAtoms = ([0, 1] as const).map((c) =>
  atom({
    key: `${alternativeForChoiceKeyPrefix}-${c}`,
    default: { atom: createColorForAlternativeAtom(c) },
  })
) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

export const createAlternativeForChoiceAtoms = (): [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
] =>
  ([0, 1] as const).map((c) =>
    atom({
      key: `${alternativeForChoiceKeyPrefix}-${c}`,
      default: { atom: createColorForAlternativeAtom(c) },
    })
  ) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

const createFreshKey = (): string => getNextKey('refresh-key');

export const useRefreshApp = (): [string, ({ gridSize }: { gridSize: number }) => void] => {
  const [refreshKey, createKey] = useState(createFreshKey);

  const setAlternatives = alternativeForChoiceAtoms.map((a) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSetRecoilState(a)
  ) as [SetterOrUpdater<HoldColorForAlternativeAtom>, SetterOrUpdater<HoldColorForAlternativeAtom>];

  const setGridSize = useSetRecoilState(gridSizeAtom);

  const commandToCreateRefreshKey = ({ gridSize }: { gridSize: number }) => {
    setAlternatives.every((setter, i) =>
      setter({ atom: createColorForAlternativeAtom(i as PixelChoice) })
    );

    setGridSize(gridSize);
    createKey(createFreshKey);
  };

  return [refreshKey, commandToCreateRefreshKey];
};
