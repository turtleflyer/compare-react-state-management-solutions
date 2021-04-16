import { getNextKey } from '@compare-react-state-management-solutions/get-next-key';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { getUseInterstate } from '@smart-hooks/use-interstate';
import { useState } from 'react';
import { getNextAtom } from '../helpers/getNextAtom';
import type {
  AlternativeForChoice,
  AlternativeForChoiceAtom,
  Atom,
  ColorForAlternative,
  ColorForAlternativeAtom,
  PixelChoice,
  State,
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

export const alternativeForChoiceKeys = ([0, 1].map(
  (c) => `${alternativeForChoicePlaceholderKey}-${c}`
) as readonly AlternativeForChoice[]) as readonly [AlternativeForChoice, AlternativeForChoice];

export function createColorForAlternativeAtom(choice: PixelChoice): ColorForAlternativeAtom {
  return getNextAtom(
    `${colorForAlternativePlaceholderKey}-${choice}` as ColorForAlternative,
    getRandomColor(DEF_COLOR)
  );
}

function createAlternativeForChoiceAtoms() {
  return (alternativeForChoiceKeys.map((k, i) => [
    k,
    createColorForAlternativeAtom(i as PixelChoice),
  ]) as readonly AlternativeForChoiceAtom[]) as readonly [
    AlternativeForChoiceAtom,
    AlternativeForChoiceAtom
  ];
}

const initialState = {
  [choiceForPixelPlaceholderKey]: 0,
  [colorForAlternativePlaceholderKey]: DEF_COLOR,
  [gridSizeKey]: DEF_GRID_SIZE,
  [rememberActiveChoiceKey]: 0,
} as State;

let storedAtoms: State = { ...initialState };

function addAtoms<K extends keyof State>(...atoms: Atom<K>[]): void {
  atoms.forEach(([key, record]) => {
    storedAtoms = { ...storedAtoms, [key]: record };
  });
}

addAtoms(...createAlternativeForChoiceAtoms());

export function getAtom<K extends keyof State>(key: K): Atom<K> {
  return [key, storedAtoms[key]] as [K, State[K]];
}

export const { useInterstate, Scope } = getUseInterstate<State>();

function createFreshKey(): string {
  return getNextKey('scope');
}

export function useRefreshScope(): [string, ({ gridSize }: { gridSize: number }) => void] {
  const [key, createKey] = useState(createFreshKey);

  function commandToCreateFreshKeyForScope({ gridSize }: { gridSize: number }): void {
    addAtoms([gridSizeKey, gridSize], ...createAlternativeForChoiceAtoms());
    createKey(createFreshKey);
  }

  return [key, commandToCreateFreshKeyForScope];
}
