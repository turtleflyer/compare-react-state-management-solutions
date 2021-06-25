import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useState } from 'react';
import type { SetterOrUpdater } from 'recoil';
import { atom, snapshot_UNSTABLE, useGotoRecoilSnapshot, useSetRecoilState } from 'recoil';
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

export const rememberActiveChoiceAtom = atom({ key: rememberActiveChoiceKey, default: 0 });

const alternativeForChoiceKeyPrefixes = ([0, 1] as const).map(
  (c) => `${alternativeForChoiceKeyPrefixBase}-${c}`
) as [AlternativeForChoice, AlternativeForChoice];

export const alternativeForChoiceAtoms = alternativeForChoiceKeyPrefixes.map((key, i) =>
  getNextAtom(key, { atom: createColorForAlternativeAtom(i as PixelChoice) })
) as [AlternativeForChoiceAtom, AlternativeForChoiceAtom];

export const nullPlaceholderAtom = atom({ key: 'null-placeholder-atom', default: null });

const initStateSnapshot = snapshot_UNSTABLE();
initStateSnapshot.retain();

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
  const [gridSize, setGridSize] = useState(defGridSize);
  const initState = useGotoRecoilSnapshot();

  const setAlternativesForChoice = alternativeForChoiceAtoms.map(useSetRecoilState) as [
    SetterOrUpdater<HoldColorForAlternativeAtom | null>,
    SetterOrUpdater<HoldColorForAlternativeAtom | null>
  ];

  const commandToRefreshStage: CommandToRefreshStage = ({ gridSize: nextGridSize }) => {
    setGridSize(nextGridSize);
    initState(initStateSnapshot);

    setAlternativesForChoice.forEach((setter, i) =>
      setter({ atom: createColorForAlternativeAtom(i as PixelChoice) })
    );
  };

  return { commandToRefreshStage, gridSize };
};
