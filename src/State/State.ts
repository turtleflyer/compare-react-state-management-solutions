import { getNextKey } from '@~internal/get-next-key';
import { getRandomColor } from '@~internal/random-color';
import { useState } from 'react';
import type { SetterOrUpdater } from 'recoil';
import { atom, useSetRecoilState } from 'recoil';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoiceAtom,
  Atom,
  CarryAtomColorForAlternative,
  ChoiceForPixelAtom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  PixelChoice,
} from './StateInterface';
import {
  alternativeForChoicePlaceholderKey,
  choiceForPixelPlaceholderKey,
  colorForAlternativePlaceholderKey,
  gridSizeKey,
  rememberActiveChoiceKey,
} from './StateInterface';

export const DEF_GRID_SIZE = 32;
export const DEF_COLOR = '#AAAAAA';
export const INPUT_WAITING_DELAY = 3000;
export const DEF_PIXELS_PERCENT_TO_PAINT = 30;

export function createColorForAlternativeAtom(choice: PixelChoice): Atom<ColorForAlternative> {
  return getNextAtom(
    `${colorForAlternativePlaceholderKey}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );
}

export const choiceForPixelPlaceholderAtom = atom({
  key: choiceForPixelPlaceholderKey,
  default: 0,
}) as ChoiceForPixelAtom;

export const colorForAlternativePlaceholderAtom = atom({
  key: colorForAlternativePlaceholderKey,
  default: DEF_COLOR,
}) as ColorForAlternativeAtom;

export const gridSizeAtom = atom({ key: gridSizeKey, default: DEF_GRID_SIZE });

export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoiceKey, default: 0 });

export const alternativeForChoiceAtoms = (([0, 1] as const).map((c) =>
  atom({
    key: `${alternativeForChoicePlaceholderKey}-${c}`,
    default: { atom: createColorForAlternativeAtom(c) },
  })
) as readonly AlternativeForChoiceAtom[]) as readonly [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
];

export function createAlternativeForChoiceAtoms(): readonly [
  AlternativeForChoiceAtom,
  AlternativeForChoiceAtom
] {
  return (([0, 1] as const).map((c) =>
    atom({
      key: `${alternativeForChoicePlaceholderKey}-${c}`,
      default: { atom: createColorForAlternativeAtom(c) },
    })
  ) as readonly AlternativeForChoiceAtom[]) as readonly [
    AlternativeForChoiceAtom,
    AlternativeForChoiceAtom
  ];
}

function createFreshKey(): string {
  return getNextKey('refresh-key');
}

export function useRefreshApp(): [string, ({ gridSize }: { gridSize: number }) => void] {
  const [refreshKey, createKey] = useState(createFreshKey);
  const setAlternatives = (alternativeForChoiceAtoms.map((a) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSetRecoilState(a)
  ) as readonly SetterOrUpdater<CarryAtomColorForAlternative>[]) as readonly [
    SetterOrUpdater<CarryAtomColorForAlternative>,
    SetterOrUpdater<CarryAtomColorForAlternative>
  ];
  const setGridSize = useSetRecoilState(gridSizeAtom);

  function commandToCreateRefreshKey({ gridSize }: { gridSize: number }) {
    setAlternatives.every((setter, i) =>
      setter({ atom: createColorForAlternativeAtom(i as PixelChoice) })
    );

    setGridSize(gridSize);
    createKey(createFreshKey);
  }

  return [refreshKey, commandToCreateRefreshKey];
}
