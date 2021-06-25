import { drawPixels } from '@compare-react-state-management-solutions/draw-pixels';
import { getRandomColor } from '@compare-react-state-management-solutions/random-color';
import { useEffect, useState } from 'react';
import {
  selector,
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { drawPixelToPaint } from './helpers/drawPixelToPaint';
import {
  alternativeForChoiceAtoms,
  choiceForPixelPlaceholderAtom,
  colorForAlternativePlaceholderAtom,
  createColorForAlternativeAtom,
  nullPlaceholderAtom,
  rememberActiveChoiceAtom,
} from './State/State';
import type {
  AlternativeForChoiceAtom,
  ColorValue,
  HoldColorForAlternativeAtom,
  PixelChoice,
} from './State/StateInterface';
import { storeAtomsMethods } from './State/storeAtomsMethods';

const ONE_HUNDRED_PERCENT = 100;

type ManageColorState = [ColorValue, SetterOrUpdater<ColorValue>];

export const useRepaintRow = (): (() => void) => {
  const alternatives = alternativeForChoiceAtoms.map(useAlternative) as [
    HoldColorForAlternativeAtom | null,
    HoldColorForAlternativeAtom | null
  ];

  const [activeChoice, setActiveChoice] = useRecoilState(rememberActiveChoiceAtom);
  const colorsState = alternatives.map(useColorState) as [ManageColorState, ManageColorState];

  return (): void => {
    const [prevColor, setNextColor] = colorsState[activeChoice];
    const nextPotentialChoice = (1 - activeChoice) as PixelChoice;

    if (alternatives[nextPotentialChoice] !== null) {
      setActiveChoice(nextPotentialChoice);
    }

    if (alternatives[activeChoice] !== null) {
      setNextColor(getRandomColor(prevColor));
    }
  };
};

function useAlternative(
  altForChoiceAtom: AlternativeForChoiceAtom
): HoldColorForAlternativeAtom | null {
  return useRecoilValue(altForChoiceAtom);
}

function useColorState(alt: HoldColorForAlternativeAtom | null): ManageColorState {
  return useRecoilState(alt?.atom ?? colorForAlternativePlaceholderAtom);
}

export const useDisableRows = (): (() => void) | null => {
  const [possibleAlternative, setAlternative] = useRecoilState(alternativeForChoiceAtoms[1]);
  const setActiveChoice = useSetRecoilState(rememberActiveChoiceAtom);

  return possibleAlternative === null
    ? null
    : () => {
        setAlternative(null);
        setActiveChoice(0);
      };
};

export const useEnableRows = (): (() => void) | null => {
  const [possibleAlternative, setAlternative] = useRecoilState(alternativeForChoiceAtoms[1]);

  return possibleAlternative === null
    ? () => {
        setAlternative({
          atom: createColorForAlternativeAtom(1),
        });
      }
    : null;
};

export const usePaintRandomSinglePixelDependedOnGridSize = ({
  gridSize,
}: {
  gridSize: number;
}): (() => void) => {
  const [atomToPaint, setAtomToPaint] = useState({ atom: choiceForPixelPlaceholderAtom });
  const paintRandomPixel = useSetRecoilState(atomToPaint.atom);

  useEffect(() => {
    paintRandomPixel((prev) => (1 - prev) as PixelChoice);
  }, [atomToPaint]); // eslint-disable-line react-hooks/exhaustive-deps

  return (): void => {
    setAtomToPaint({ atom: drawPixelToPaint(gridSize ** 2) });
  };
};

export const usePaintRandomPixelsDependedOnGridSize = ({
  gridSize,
}: {
  gridSize: number;
}): ((percentage: number) => void) => {
  const [selectorToPaint, setSelectorToPaint] = useState(nullPlaceholderAtom);
  const paintPixels = useSetRecoilState(selectorToPaint);

  useEffect(() => {
    selectorToPaint !== nullPlaceholderAtom && paintPixels(null);
  }, [paintPixels, selectorToPaint]);

  return (percentage: number): void => {
    const allPixelsNumber = gridSize ** 2;
    const pixelsNumberToPaint = (allPixelsNumber * percentage) / ONE_HUNDRED_PERCENT;

    setSelectorToPaint(
      selector({
        key: 'paint-random-pixels',
        get: () => null,
        set: ({ set }) => {
          drawPixels(allPixelsNumber, pixelsNumberToPaint).forEach((p) =>
            set(
              storeAtomsMethods.get(p) ?? throwErrorAtomMustBeDefined(),
              (prevChoice) => (1 - prevChoice) as PixelChoice
            )
          );
        },
      })
    );
  };
};

function throwErrorAtomMustBeDefined(): never {
  throw Error('Atom must be defined');
}
