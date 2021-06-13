import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useEffect, useState } from 'react';
import type { SetterOrUpdater } from 'recoil';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  AlternativeForChoiceAtom,
  Atom,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  HoldColorForAlternativeAtom,
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

export const gridSizeAtom = atom({ key: gridSizeKey, default: 0 });

export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoiceKey, default: 0 });

const alternativeForChoiceKeyPrefixes = ([0, 1] as const).map(
  (c) => `${alternativeForChoiceKeyPrefixBase}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const alternativeForChoiceAtoms = alternativeForChoiceKeyPrefixes.map((key, i) =>
  getNextAtom(key, { atom: createColorForAlternativeAtom(i as PixelChoice) })
) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

export const useRefreshApp = ({
  defGridSize,
}: {
  defGridSize: number;
}): {
  refreshKey: string;
  commandToCreateRefreshKey: (arg: { gridSize: number }) => void;
  gridSize: number;
} => {
  const [gridSize, setGridSize] = useRecoilState(gridSizeAtom);

  const setAlternativesForChoice = alternativeForChoiceAtoms.map(useSetRecoilState) as [
    SetterOrUpdater<HoldColorForAlternativeAtom | null>,
    SetterOrUpdater<HoldColorForAlternativeAtom | null>
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setGridSize(defGridSize), []);

  const createFreshKey = (): string => getNextKey('refresh-key');

  const [refreshKey, createRefreshKey] = useState(createFreshKey);

  useEffect(() => createRefreshKey(createFreshKey), [gridSize]);

  const commandToCreateRefreshKey = ({ gridSize: nextGridSize }: { gridSize: number }) => {
    setGridSize(nextGridSize);

    setAlternativesForChoice.forEach((setter, i) =>
      setter({ atom: createColorForAlternativeAtom(i as PixelChoice) })
    );
  };

  return { refreshKey, commandToCreateRefreshKey, gridSize };
};
